export enum generateTextOptions {
  IMPROVE_WRITING = "improve_writing",
  FIX_SPELLINGS_AND_GRAMMAR = "fix_spellings_&_grammar",
  TRANSLATE = "translate",
  MAKE_LONGER = "make_longer",
  MAKE_SHORTER = "make_shorter",
  SIMPLIFY_LANGUAGE = "simplify_language",
  CONTINUE_WRITING = "continue_writing",
  COUNTER_ARGUMENT = "counter_argument",
  TRY_AGAIN = "try_again",
  SUMMARIZE = "summarize",
  CUSTOM = "custom",
}

export const prompts = [
  {
    option: generateTextOptions.IMPROVE_WRITING,
    prompt: "Enhance the structure, clarity, and tone of the text.",
  },
  {
    option: generateTextOptions.FIX_SPELLINGS_AND_GRAMMAR,
    prompt: "Correct any spelling and grammatical mistakes in the text.",
  },
  {
    option: generateTextOptions.TRANSLATE,
    prompt: "Translate the text into the language specified above.",
  },
  {
    option: generateTextOptions.MAKE_LONGER,
    prompt: "Expand the content to provide more details and depth.",
  },
  {
    option: generateTextOptions.MAKE_SHORTER,
    prompt: "Condense the text while keeping the key points intact.",
  },
  {
    option: generateTextOptions.SIMPLIFY_LANGUAGE,
    prompt: "Rewrite the text in simpler language to enhance readability.",
  },
  {
    option: generateTextOptions.CONTINUE_WRITING,
    prompt:
      "Continue writing from where the text leaves off, matching the author's voice, tone, and topic. Produce one to two new paragraphs that flow naturally from the existing content.",
  },
  {
    option: generateTextOptions.COUNTER_ARGUMENT,
    prompt:
      "Write a thoughtful counter-argument to the text, presenting opposing viewpoints in a balanced tone.",
  },
  {
    option: generateTextOptions.TRY_AGAIN,
    prompt: "Rewrite the text with a new variation.",
  },
  {
    option: generateTextOptions.SUMMARIZE,
    prompt: "Summarise the text in a concise paragraph.",
  },
];

export const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
] as const;

export type Language = (typeof LANGUAGES)[number];
