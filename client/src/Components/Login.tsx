import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userState);

    const response = await axios.post("http://localhost:4000/api/auth/login", {
      email: userState.email,
      password: userState.password,
    });
    const data = response.data;

    if (!data.success) return window.alert(data.error);

    localStorage.setItem("email", userState.email);
    localStorage.setItem("auth-token", data.authToken);

    navigate("/home");
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
