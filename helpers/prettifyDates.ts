const prettifyDate = (dateString: string | undefined) => {
  if(!dateString) return ""
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    // weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export default prettifyDate;
