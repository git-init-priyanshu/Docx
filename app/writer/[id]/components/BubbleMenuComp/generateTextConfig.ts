export enum generateTextOptions {
  IMPROVE_WRITING = "improve_writing",
  FIX_SPELLINGS_AND_GRAMMAR = "fix_spellings_&_grammar",
  TRANSLATE = "translate",
  MAKE_LONGER = "make_longer",
  MAKE_SHORTER = "make_shorter",
  SIMPLIFY_LANGUAGE = "simplify_language",
  TRY_AGAIN = "try_again"
}

export const prompts = [
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
