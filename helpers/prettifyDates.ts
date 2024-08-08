type OptionsType = {
  weekday?: "narrow" | "short" | "long";
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "narrow" | "short" | "long";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  timeZoneName?: "short" | "long";
  hour12?: boolean;
  era?: "narrow" | "short" | "long";
  timeZone?: string;
  fractionalSecondDigits?: 1 | 2 | 3;
};

const prettifyDate = (dateString: string | undefined, options: OptionsType) => {
  if (!dateString) return ""
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export default prettifyDate;
