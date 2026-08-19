/**
 * The slice of the Google Docs API `documents.get` response this app reads.
 *
 * Hand-written rather than pulled from `googleapis`: the full package is a
 * server-side client with a very large type surface, and the import runs
 * entirely in the browser against a single REST endpoint. Only the fields the
 * mapper consumes are declared, so anything Google adds is simply ignored.
 *
 * Reference: https://developers.google.com/docs/api/reference/rest/v1/documents
 */

export type RgbColor = {
  red?: number;
  green?: number;
  blue?: number;
};

export type OptionalColor = {
  color?: { rgbColor?: RgbColor };
};

export type TextStyle = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  foregroundColor?: OptionalColor;
  backgroundColor?: OptionalColor;
  weightedFontFamily?: { fontFamily?: string };
  link?: { url?: string };
};

export type NamedStyleType =
  | "TITLE"
  | "SUBTITLE"
  | "HEADING_1"
  | "HEADING_2"
  | "HEADING_3"
  | "HEADING_4"
  | "HEADING_5"
  | "HEADING_6"
  | "NORMAL_TEXT"
  | "NAMED_STYLE_TYPE_UNSPECIFIED";

export type Alignment =
  | "START"
  | "CENTER"
  | "END"
  | "JUSTIFIED"
  | "ALIGNMENT_UNSPECIFIED";

export type ParagraphStyle = {
  namedStyleType?: NamedStyleType;
  alignment?: Alignment;
};

export type TextRun = {
  content?: string;
  textStyle?: TextStyle;
};

export type ParagraphElement = {
  textRun?: TextRun;
  inlineObjectElement?: { inlineObjectId?: string };
  horizontalRule?: object;
  pageBreak?: object;
  columnBreak?: object;
  footnoteReference?: object;
};

export type Bullet = {
  listId?: string;
  nestingLevel?: number;
};

export type Paragraph = {
  elements?: ParagraphElement[];
  paragraphStyle?: ParagraphStyle;
  bullet?: Bullet;
};

/**
 * A cell holds structural elements of its own, so a table can contain lists,
 * headings and further tables. The type is recursive for that reason.
 */
export type TableCell = {
  content?: StructuralElement[];
};

export type TableRow = {
  tableCells?: TableCell[];
};

export type Table = {
  tableRows?: TableRow[];
};

export type StructuralElement = {
  paragraph?: Paragraph;
  table?: Table;
  tableOfContents?: object;
  sectionBreak?: object;
};

/**
 * A level's glyph tells ordered from unordered apart: numbered levels carry
 * `glyphType` (DECIMAL, UPPER_ALPHA, ...) while bulleted levels carry a
 * literal `glyphSymbol` such as "●".
 */
/**
 * Images are stored once per document and referenced by id from the paragraph.
 * `contentUri` is a short-lived download URL — Google documents it as valid for
 * around 30 minutes — so anything keeping the image has to copy the bytes
 * during the import rather than store the link.
 */
export type InlineObject = {
  inlineObjectProperties?: {
    embeddedObject?: {
      title?: string;
      description?: string;
      imageProperties?: { contentUri?: string };
    };
  };
};

export type NestingLevel = {
  glyphType?: string;
  glyphSymbol?: string;
};

export type List = {
  listProperties?: { nestingLevels?: NestingLevel[] };
};

export type NamedStyle = {
  namedStyleType?: NamedStyleType;
  textStyle?: TextStyle;
};

export type GoogleDoc = {
  title?: string;
  body?: { content?: StructuralElement[] };
  lists?: Record<string, List>;
  inlineObjects?: Record<string, InlineObject>;
  namedStyles?: { styles?: NamedStyle[] };
};
