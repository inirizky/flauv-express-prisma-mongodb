import express from "express";
import GenerateTextfromImage from "../services/gemini.services.js";
import { prisma } from "../lib/prisma.js";
import { uploadImage } from "../services/uploadSupabase.js";

export const generateUserPlantByAI = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }

  const { imageUrl } = await uploadImage(file);

  try {
    const prompt = `
You are an AI plant identifier.
From the provided plant image, identify the plant and generate a pure JSON output in the following format:

{
   "name": "",                // Common name (e.g. Snake Plant)
  "latinName": "",           // Scientific name
  "water_frequency": 0,      // Number of days between watering
  "sunlight": "",            // Choose only 1: Full Sun, Partial Sun, Partial Shade, Dappled Sun, Full Shade
  "soilType": "",            // Choose only 1: Clay, Sandy, Loamy, Silt, Peat, Chalky
  "care_instructions": "",   // Short care guide for maintaining the plant
}

Rules:
- The output must be valid JSON only, with no additional text or explanation.
- All text values must be in English.
- If uncertain, provide the closest possible estimation based on the image.
- The value of "water_frequency" must be a number (in days).
- The value of "sunlight" and "soilType" must be same as the example given

`;
    const aiDescription = await GenerateTextfromImage(
      file.buffer,
      imageUrl,
      prompt
    );

    const search = aiDescription.data.name.toLowerCase();
    const keywords = search.split(" ").filter(Boolean); // buang spasi kosong

    const plantBase = await prisma.plantBase.findMany({
      where: {
        OR: keywords.flatMap((word) => [
          { name: { contains: word } },
          { latinName: { contains: word } },
        ]),
      },
      take: 4,
    });

    console.log(aiDescription);

    if (plantBase.length === 0) {
      const test = await prisma.plantBase.create({
        data: {
          name: aiDescription.data.name,
          latinName: aiDescription.data.latinName,
          water_frequency: aiDescription.data.water_frequency,
          sunlight: aiDescription.data.sunlight,
          imageUrl: imageUrl,
          soilType: aiDescription.data.soilType,
          care_instructions: aiDescription.data.care_instructions,
          generateBy: "AI",
        },
      });
      console.log(test);
    }

    const data = {
      data: aiDescription.data,
      // imageUrl: aiDescription.data.imageUrl,
      plantBase: plantBase,
    };
    res.status(200).json({
      message: "Generate successfuly",
      status: 200,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Error", error: error, status: 403 });
  }
};

export const createUserPlant = async (req, res) => {
  const {
    name,
    imageUrl,
    latinName,
    water_frequency,
    soilType,
    sunlight,
    care_instructions,
    plantBaseId,
  } = req.body;

  try {
    await prisma.userPlant.create({
      data: {
        name,
        latinName,
        imageUrl,
        water_frequency: water_frequency,
        soilType,
        sunlight,
        care_instructions,
        plantBaseId,
        userId: req.user.id,
      },
    });

    res.json({ message: "Success", status: 200 });
  } catch (error) {
    console.log(error);
    console.log(error);

    res.json({ message: "Error", error: error, status: 403 }).status(403);
  }
};
export const readUserPlantById = async (req, res) => {
  // console.log(res);
  // const salt = await bcrypt.genSalt();
  // const hashPassword = await bcrypt.hash(password, salt);
  const { id } = req.params;
  try {
    const userPlant = await prisma.userPlant.findUnique({
      where: {
        id: id,
        userId: req.user.id,
      },
      include: {
        plantProgress: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    res.status(200).json({ message: "Success", status: 200, data: userPlant });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error", error: error, status: 400 });
  }
};
export const readUserPlants = async (req, res) => {
  // console.log(res);
  // const salt = await bcrypt.genSalt();
  // const hashPassword = await bcrypt.hash(password, salt);

  console.log("hit");

  try {
    const userPlant = await prisma.userPlant.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        plantProgress: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });
    console.log(userPlant);

    res.json({ message: "Success", status: 200, data: userPlant });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 400 });
  }
};
export const editUserPlantById = async (req, res) => {
  const { id } = req.params;
  const { name, soilType, sunlight, water_frequency, imageUrl } = req.body;

  try {
    const userPlant = await prisma.userPlant.update({
      where: {
        id: id,
        userId: req.user.id,
      },
      data: {
        name,
        soilType,
        sunlight,
        water_frequency,
        imageUrl,
      },
    });

    res.json({ message: "Success", status: 200, data: userPlant });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error", error: error, status: 400 });
  }
};
export const deleteUserPlant = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.userPlant.delete({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    // deleteFile(movie.imgUrl);
    res.json({ message: "User plant has been deleted", status: 200 });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 500 });
  }
};

export const createMovieController = () => {
  const route = express.Router();

  return route;
};
