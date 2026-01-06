import GenerateTextfromImage from "../services/gemini.services.js";
import { getImageUrl } from "../services/uploadImage.service.js";
export const generateAi = async (req, res) => {
  const image = getImageUrl(req.file);

  // console.log(imgUrl);
  console.log(req.file);

  // const imagePath = path.resolve(imgUrl);

  try {
    const prompt = `
Kamu adalah AI pengenal tanaman.
Dari gambar tanaman berikut, identifikasi dan hasilkan deskripsi dalam format JSON murni berikut:

{
  "name": "",                // Nama umum tanaman (contoh: Lidah Mertua)
  "latinName": "",           // Nama latin tanaman (contoh: Sansevieria trifasciata)
  "water_frequency": 0,      // Frekuensi penyiraman dalam hari (contoh: 3 artinya disiram setiap 3 hari)
  "sunlight": "",            // Jenis cahaya yang dibutuhkan (contoh: "Cahaya terang tidak langsung")
  "soilType": "",            // Jenis tanah yang cocok (contoh: "Tanah berdrainase baik")
  "care_instructions": ""    // Instruksi singkat cara perawatan tanaman
}

Aturan:
- Pastikan output valid JSON tanpa tambahan teks lain.
- Jika tidak yakin, isi dengan nilai yang paling mendekati berdasarkan gambar.
- Nilai "water_frequency" wajib angka (dalam hari).
`;
    const aiDescription = await GenerateTextfromImage(image, prompt);

    // const plantBase = await prisma.plantBase.findMany({
    //   where: {
    //     OR: [
    //       {
    //         name: {
    //           contains: aiDescription.data.name,
    //         },
    //       },
    //       {
    //         latinName: {
    //           contains: aiDescription.data.latinName,
    //         },
    //       },
    //     ],
    //   },
    //   take: 3,
    // });

    // if (!plantBase) {
    //   await prisma.plantBase.create({
    //     data: {
    //       name: aiDescription.data.name,
    //       latinName: aiDescription.data.latinName,
    //       water_frequency: aiDescription.data.water_frequency,
    //       sunlight: aiDescription.data.sunlight,
    //       soilType: aiDescription.data.soilType,
    //       care_instructions: aiDescription.data.care_instructions,
    //       generateBy: "AI",
    //     },
    //   });
    // }

    console.log(aiDescription);

    const data = {
      data: aiDescription.data,
      imageUrl: aiDescription.imageUrl,
      // plantBase: plantBase,
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
