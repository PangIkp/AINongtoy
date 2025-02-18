import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config(); // โหลดค่าจาก .env

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const generateImage = async (prompt: string) => {
  try {
    const output = await replicate.run(
      "prompthero/openjourney-v4", // 🔥 ใช้ OpenJourney v4
      {
        input: { prompt }
      }
    );

    console.log("✅ Image URL:", output);
    return output;
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// 🔥 ทดลองสร้างภาพ
generateImage("A fantasy warrior with glowing blue armor");
