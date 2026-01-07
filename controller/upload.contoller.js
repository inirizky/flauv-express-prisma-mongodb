import { supabase } from "../lib/supabase.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const fileName = `assets/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from("assets") // nama bucket
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("assets").getPublicUrl(fileName);

    return res.json({
      message: "Upload berhasil",
      url: data.publicUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload gagal" });
  }
};
