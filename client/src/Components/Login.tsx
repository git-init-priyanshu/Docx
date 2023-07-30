import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  interface userState {
    email: string;
    password: string;
  }
  const [userState, setUserState] = useState<userState>({
    email: "",
    password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ ...userState, [e.target.name]: [e.target.value] });
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userState);
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
