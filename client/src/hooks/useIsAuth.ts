import axios from "axios";

export const useIsAuth = async () => {
  const token = localStorage.getItem("token");

  if (!token) return;
  const response = await axios.post("api/auth/find-user", { token });

  const isValidUser = response.data.success;
  if (isValidUser) return true;
  return false;
};
