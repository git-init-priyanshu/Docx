import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const URL = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_URL
    : import.meta.env.VITE_PROD_URL;
  interface userState {
    email: string;
    password: string;
    confirm_password: string;
  }

  const [userState, setUserState] = useState<userState>({
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Todo: password === confirm_password

    const response = await axios.post(
      `http://${URL}/api/auth/save-user-details`,
      {
        email: userState.email,
        password: userState.password,
      }
    );
    const data = response.data;

    if (!data.success) {
      navigate("/");
      return window.alert(data.error);
    }

    localStorage.setItem("email", userState.email);
    localStorage.setItem("token", data.authToken);

    // To avoid bugs
    setTimeout(() => {
      navigate("/home");
    }, 100);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="form-title">Signup</div>
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
      <div className="group">
        <input
          type="password"
          name="confirm_password"
          className={`${userState.confirm_password !== "" ? "used" : ""}`}
          value={userState.confirm_password}
          onChange={handleOnChange}
        />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label>Confirm Password</label>
      </div>
      <button type="submit" className="button buttonBlue">
        Submit
        <div className="ripples buttonRipples">
          <span className="ripplesCircle"></span>
        </div>
      </button>
      <p className="footer">
        Already have an account? <Link to={"/"}>Login</Link>
      </p>
    </form>
  );
}
