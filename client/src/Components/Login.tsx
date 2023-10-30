import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";

import { FIND_USER_QUERY } from "../Graphql/queries";
import { LOGIN_MUTATION } from "../Graphql/mutations";

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

  const [login, { data: loginData }] = useMutation(LOGIN_MUTATION);

  // If user already has token, redirect to "/home"
  const token = localStorage.getItem("token");
  const [findUser, { data }] = useLazyQuery(FIND_USER_QUERY);

  useEffect(() => {
    findUser({
      variables: {
        token,
      },
    });
  }, [findUser, token]);
  if (data?.findUser) navigate("/home");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      variables: {
        data: {
          emailId: userState.email,
          password: userState.password,
        },
      },
    });
  };
  if (loginData?.login.success) {
    localStorage.setItem("email", userState.email);
    localStorage.setItem("token", loginData.login.token);

    // To avoid bugs
    setTimeout(() => {
      navigate("/home");
    }, 100);
  }

  // if (loading) return "Loading...";
  // if (error) return window.alert(error.message);
  // if (loginLoading) return "Loading...";
  // if (loginError) return window.alert(loginError.message);

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
