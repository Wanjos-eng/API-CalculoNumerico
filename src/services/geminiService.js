const { GoogleGenerativeAI } = require("@google/generative-ai");

const enviarPerguntaIA = async (contexto, pergunta) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Contexto: ${JSON.stringify(contexto)}. Pergunta: ${pergunta}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { enviarPerguntaIA };
