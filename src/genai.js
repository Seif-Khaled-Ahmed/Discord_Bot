const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const dotenv = require("dotenv");
dotenv.config();
key = process.env.API_KEY;
// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const queue = [];
queue.push();
const genAI = new GoogleGenerativeAI(key);
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "",
  generationConfig: {
    candidateCount: 1,
    maxOutputTokens: 900,
    temperature: 2.0,
    top_p: 0.95,
    top_k: 64,
  },
  safetySettings,
});
const chat = model.startChat({
  history: [],
});
async function generate(prompt) {
  try {
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.log(error);
    return;
  }
}

// const prompt = "Hello";
// generate(prompt);
module.exports = {
  generate,
};
