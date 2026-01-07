import { supabase } from "../lib/supabase.js";

export const uploadImage = async (file) => {
  try {
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

    console.log(data);

    return {
      imageUrl: data.publicUrl,
    };
  } catch (err) {
    throw new Error("Error uploading image to Supabase: " + err.message);
  }
};
