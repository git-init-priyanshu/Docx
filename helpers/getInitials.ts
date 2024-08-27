const getInitials = (name: string) => {
  let initials = name.split(" ");

  if (initials.length > 2) return initials[0][0] + initials[1][0];
  return initials[0][0];
};

export default getInitials;
