import { GoogleGenAI } from "@google/genai";
import fs from "fs";

(async () => {
    try {

        const ai = new GoogleGenAI({
            apiKey: "AIzaSyAxtUJukLiciIfwAkcjovY2AHj2MWK4-yU"
        });

        // const imagePrompt = "A charming, relatable Indian woman standing casually, wearing a pastel yellow cotton kurta with delicate embroidery at the neckline, paired with fitted blue jeans. She has warm medium brown skin with golden undertones, an oval-shaped face with soft features, expressive almond-shaped dark brown eyes, and a gentle, slightly dimpled smile. Her black wavy hair is tied in a low ponytail, with a few loose strands framing her face. She wears simple silver stud earrings. The lighting is soft and natural, suggesting a warm morning glow. The style is realistic with clean, warm tones and high detail—ideal for a character portrait.";

        // Step 1: Generate an image with Imagen. (COMMENTED OUT FOR TESTING)
        // const imagenResponse = await ai.models.generateImages({
        //     model: "imagen-3.0-generate-002",
        //     prompt: imagePrompt,
        // });

        // Save the generated image bytes directly to disk (COMMENTED OUT FOR TESTING)
        // const imageBytes = imagenResponse.generatedImages[0]?.image?.imageBytes;
        // if (imageBytes) {
        //     fs.writeFileSync("generated_image.png", Buffer.from(imageBytes, 'base64'));
        //     console.log(`Generated image saved to generated_image.png`);
        // } else {
        //     console.error("No image bytes found in the response");
        // }

        // Load existing image for testing
        const existingImageBytes = fs.readFileSync("ref-2.png");
        const base64ImageBytes = existingImageBytes.toString('base64');
        console.log(`Using existing image: ref-2.png`);

        const videoPrompt = "A smooth tracking shot starts with a shiny packet of chocolate biscuits resting on a clean kitchen counter, transitioning from sharp focus on the packet to a cozy modern kitchen scene bathed in warm morning sunlight. The sun filters through a window onto light-colored walls, wooden shelves, stainless steel utensils, ceramic tea cups, and a small indoor plant on the windowsill, creating a natural cinematic glow. Ambient sound fills the scene: soft kitchen atmosphere with gentle utensil clinks, the crinkle of a crisp packet, and a light cheerful music underscore. No subtitles, no text overlay.";

        let operation = await ai.models.generateVideos({
            model: "veo-3.0-generate-preview",
            prompt: videoPrompt,
            image: {
                imageBytes: base64ImageBytes,
                mimeType: "image/png",
            },
        });

        console.log(operation);

        while (!operation.done) {
            console.log("Waiting for video generation to complete...");
            await new Promise((resolve) => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({
                operation: operation,
            });
        }

        ai.files.download({
            file: operation?.response?.generatedVideos[0]?.video,
            downloadPath: "veo3_with_image_input.mp4",
        });

        console.log(`Generated video saved to veo3_with_image_input.mp4`);


    } catch (error) {
        console.error(error);
    }
})();

