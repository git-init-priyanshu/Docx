import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { URL } from "../App";

export default function Login() {
  const navigate = useNavigate();

  interface userState {
    email: string;
    password: string;
  }
  const [userState, setUserState] = useState<userState>({
    email: "",
    password: "",
  });

  // If user already has token, redirect to "/home"
  useEffect(() => {
    const isUserAuthenticated = async () => {
      const token = localStorage.getItem("token");

      // Check if token is valid or not
      if (!token) return;
      const response = await axios.post(
        `${URL}api/auth/find-user`,
        { token }
      );
      const isValidToken = response.data.success;

      if (isValidToken) return navigate("/home");
      return;
    };
    isUserAuthenticated();
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await axios.post(`${URL}/api/auth/login`, {
      email: userState.email,
      password: userState.password,
    });
    const data = response.data;

    if (!data.success) return window.alert(data.error);

    localStorage.setItem("email", userState.email);
    localStorage.setItem("token", data.authToken);

    // To avoid bugs
    setTimeout(() => {
      navigate("/home");
    }, 100);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="form-title">Login</div>
      <div className="group">
        <input
          type="email"
          name="email"
          className={`${userState.email !== "" ? "used" : ""}`}
          value={userState.email}
          onChange={handleOnChange}
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Email</label>
      </div>
      <div className="group">
        <input
          type="password"
          name="password"
          className={`${userState.password !== "" ? "used" : ""}`}
          value={userState.password}
          onChange={handleOnChange}
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Password</label>
      </div>
      <button type="submit" className="button buttonBlue">
        Login
        <div className="ripples buttonRipples">
          <span className="ripplesCircle"></span>
        </div>
      </button>
      <p className="footer">
        Don't have an account? <Link to={"/signup"}>Signup</Link>
      </p>
    </form>
  );
}
