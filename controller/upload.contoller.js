import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadImage = async (req, res) => {
  try {
    const { name } = req.body;
    const imgUrl = `assets/${req.file.filename}`;

    const product = await prisma.product.create({
      data: { name, imgUrl },
    });

    res.status(201).json({
      message: "Upload berhasil!",
      data: product,
    });
  } catch (error) {
    console.error("Upload gagal:", error);
    res.status(500).json({ message: "Upload gagal!" });
  }
};
