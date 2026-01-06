import GenerateTextfromImage from "../services/gemini.services.js";
import { getImageUrl } from "../services/uploadImage.service.js";
import { prisma } from "../lib/prisma.js";

export const createPlantProgress = async (req, res) => {
  const { name, progress, notes, plantId } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
        status: 400,
      });
    }

    const image = getImageUrl(req.file);

    console.log("name", name);
    console.log("Progress", progress);
    console.log("note", notes);

    const prompt = `
Plant analysis task.

INPUT:
- Plant name: ${name}
- User notes: ${notes}
- Previous progress (oldest → newest):
${progress}

RULES:
- Growth stages order:
  seedling > vegetative > budding > flowering > fruiting > dormant
- growthStage MUST NOT go backward.
- New growthStage = SAME or +1 step from latest.
- If image unclear → keep latest growthStage.
- progressType MUST match growthStage.
- condition may change.

BASELINE:
Use LAST progress item as current state.

OUTPUT (JSON ONLY):
{
  "condition": "healthy|wilted|overwatered|underwatered|yellowing|pest detected|sunburnt|fungal infection",
  "growthStage": "seedling|vegetative|budding|flowering|fruiting|dormant",
  "progressType": "watered|fertilized|repotted|pruned|pest treated|new leaf|new flower|leaf unfurling|blooming|flower fading"
}
`;

    const aiDescription = await GenerateTextfromImage(image, prompt);

    await prisma.plantProgress.create({
      data: {
        imageUrl: aiDescription.data.imageUrl,
        notes,
        condition: aiDescription.data.condition,
        growthStage: aiDescription.data.growthStage,
        progressType: aiDescription.data.progressType,
        userPlantId: parseInt(plantId),
      },
    });

    console.log(aiDescription);

    res.json({ message: "Success", status: 200, data: aiDescription.data });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 403 }).status(403);
  }
};

export const readPlantProgress = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const userPlant = await prisma.plantProgress.findMany({
      where: {
        userPlant: {
          userId: req.user.id, // ✅ Filter lewat relasi
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        userPlant: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    });
    // console.log(userPlant);

    res.status(200).json({ message: "Success", status: 200, data: userPlant });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 400 });
  }
};
export const readPlantProgressById = async (req, res) => {
  // console.log(res);
  // const salt = await bcrypt.genSalt();
  // const hashPassword = await bcrypt.hash(password, salt);
  const { id } = req.params;
  console.log(id);

  try {
    const userPlant = await await prisma.plantProgress.findMany({
      where: {
        userPlantId: parseInt(id),
        userPlant: {
          userId: req.user.id, // ✅ Filter lewat relasi
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        userPlant: {
          select: {
            name: true,

            userId: true,
          },
        },
      },
    });
    // console.log(userPlant);

    res.status(200).json({ message: "Success", status: 200, data: userPlant });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 400 });
  }
};
