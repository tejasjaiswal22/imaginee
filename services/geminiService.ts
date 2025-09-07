import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyGenerationConfig = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        sceneDescription: {
          type: Type.STRING,
          description: "A detailed, engaging, and atmospheric description of the current scene, written in the second person ('You see...'). It should be about 2-3 paragraphs long."
        },
        imagePrompt: {
          type: Type.STRING,
          description: "A rich, descriptive prompt for an AI image generator. The style should be 'painterly, digital art, high fantasy, atmospheric, dramatic lighting'."
        },
        choices: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "An array of 3 to 4 short, action-oriented choices for the player. e.g., 'Inspect the altar', 'Leave the cave'."
        }
      },
      required: ["sceneDescription", "imagePrompt", "choices"]
    },
    // FIX: Moved systemInstruction from the generateContent call into this config object where it belongs.
    systemInstruction: "You are a master storyteller and game master for a dynamic text-based adventure game. Your responses MUST be in a valid JSON format as per the provided schema. Do not include any text, comments, or markdown backticks outside of the JSON object."
};


async function generateImage(prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
}

async function generateStoryContent(prompt: string): Promise<{ sceneDescription: string; imagePrompt: string; choices: string[] }> {
    // FIX: Removed invalid 'systemInstruction' property from the generateContent call.
    // It is now correctly placed inside the 'storyGenerationConfig' object.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: storyGenerationConfig,
    });

    try {
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        if (!parsed.sceneDescription || !parsed.imagePrompt || !Array.isArray(parsed.choices)) {
            throw new Error("Invalid JSON structure from story generation.");
        }
        return parsed;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("The story took an unexpected turn. Could not parse the narrative.");
    }
}

export async function generateInitialScene(prompt: string): Promise<{ sceneDescription: string; image: string; choices: string[] }> {
    const storyPrompt = `Create the opening scene for a text adventure game based on this theme: "${prompt}". Describe the initial setting, provide a compelling visual prompt for an AI image generator, and offer 3-4 distinct choices for the player to make.`;
    
    const { sceneDescription, imagePrompt, choices } = await generateStoryContent(storyPrompt);
    const image = await generateImage(imagePrompt);

    return { sceneDescription, image, choices };
}


export async function generateNextScene(storyContext: string, choice: string): Promise<{ sceneDescription: string; image: string; choices: string[] }> {
    const storyPrompt = `The player is in a text adventure game. Here is a summary of what has happened so far:\n${storyContext}\n\nThe player has just chosen to: "${choice}".\n\nContinue the story. Describe what happens next, provide a new visual prompt for the scene, and create 3-4 new, distinct choices for the player. Ensure the story is coherent and engaging.`;

    const { sceneDescription, imagePrompt, choices } = await generateStoryContent(storyPrompt);
    const image = await generateImage(imagePrompt);

    return { sceneDescription, image, choices };
}