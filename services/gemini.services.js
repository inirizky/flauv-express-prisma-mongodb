import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

export default async function GenerateTextfromImage(
  imageBuffer,
  imageUrl,
  prompt
) {
  const base64Image = imageBuffer.toString("base64");
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },

    { text: prompt },
  ];

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      // config: {
      //   temperature: 0.3,
      // },
    });
    let parsed;
    try {
      parsed = JSON.parse(result.text);
    } catch (err) {
      // Kadang Gemini suka nambah teks di luar JSON
      const cleaned = result.text.match(/\{[\s\S]*\}/);
      if (cleaned) {
        parsed = JSON.parse(cleaned[0]);
      } else {
        throw new Error("Gagal parse hasil AI");
      }
    }

    // console.log(filePath);/

    return {
      data: { ...parsed, imageUrl },
    };
  } catch (error) {
    console.log("Error Gemini", error);
  }
}
