// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0]?.url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
