import { GoogleGenerativeAI } from "@google/generative-ai";

export enum generateTextOptions {
  IMPROVE_WRITING = "improve_writing",
  FIX_SPELLINGS_AND_GRAMMAR = "fix_spellings_&_grammar",
  TRANSLATE = "translate",
  MAKE_LONGER = "make_longer",
  MAKE_SHORTER = "make_shorter",
  SIMPLIFY_LANGUAGE = "simplify_language",
  TRY_AGAIN = "try_again"
}

const prompts = [
  {
    option: generateTextOptions.IMPROVE_WRITING,
    prompt: "Enhance the structure, clarity, and tone of the text."
  },
  {
    option: generateTextOptions.FIX_SPELLINGS_AND_GRAMMAR,
    prompt: "Correct any spelling and grammatical mistakes in the text."
  },
  {
    option: generateTextOptions.TRANSLATE,
    prompt: "Translate the given text to the above mentioned language."
  },
  {
    option: generateTextOptions.MAKE_LONGER,
    prompt: "Expand the content to provide more details and depth."
  },
  {
    option: generateTextOptions.MAKE_SHORTER,
    prompt: "Condense the text while keeping the key points intact."
  },
  {
    option: generateTextOptions.SIMPLIFY_LANGUAGE,
    prompt: "Rewrite the text in simpler language to enhance readability."
  },
  {
    option: generateTextOptions.TRY_AGAIN,
    prompt: "Rewrite the text with a new variation."
  },
];

export const generateText = async (option: generateTextOptions, text: string, language?: string) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt: string;
    if (option === generateTextOptions.TRANSLATE) {
      if (!language) return { success: false, error: "Undefined prompt" };
      prompt = `Here is the text: ${text} and language: ${language}. ${prompts.find((e) => e.option === option)?.prompt}`;
    } else {
      prompt = `Here is the text: "${text}". ${prompts.find((e) => e.option === option)?.prompt}`
    }
    if (!prompt) return { success: false, error: "Undefined prompt" };

    const note = "Note: Provide only the required text.";
    const result = await model.generateContent(prompt + note);

    return { success: true, data: result.response.text() };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}

export default generateText;
