import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { SIGNUP_MUTATION } from "../Graphql/mutations";

export default function Signup() {
  const defaultTheme = createTheme();

  const navigate = useNavigate();

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

  const [signup, { data: signupData, error: signupError }] =
    useMutation(SIGNUP_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Todo: password === confirm_password

    signup({
      variables: {
        data: {
          emailId: userState.email,
          password: userState.password,
        },
      },
    });
  };
  if (signupData?.signup.success) {
    localStorage.setItem("email", userState.email);
    localStorage.setItem("token", signupData.signup.token);

    // To avoid bugs
    setTimeout(() => {
      navigate("/home");
    }, 100);
  }
  if (signupError) {
    navigate("/");
    window.alert(signupError.message);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                // autoComplete="new-password"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="password"
                // autoComplete="current-password"
                onChange={handleChange}
              />
            </Grid>
            <Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  {"Already have an account? Log In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    //    <form onSubmit={handleOnSubmit} id="signupForm">
    //    <div className="form-title">Signup</div>
    //    <div className="group">
    //      <input
    //        type="email"
    //        name="email"
    //        className={`${userState.email !== "" ? "used" : ""}`}
    //        value={userState.email}
    //        onChange={handleOnChange}
    //      />
    //      <span className="highlight"></span>
    //      <span className="bar"></span>
    //      <label>Email</label>
    //    </div>
    //    <div className="group">
    //      <input
    //        type="password"
    //        name="password"
    //        className={`${userState.password !== "" ? "used" : ""}`}
    //        value={userState.password}
    //        onChange={handleOnChange}
    //      />
    //      <span className="highlight"></span>
    //      <span className="bar"></span>
    //      <label>Password</label>
    //    </div>
    //    <div className="group">
    //      <input
    //        type="password"
    //        name="confirm_password"
    //        className={`${userState.confirm_password !== "" ? "used" : ""}`}
    //        value={userState.confirm_password}
    //        onChange={handleOnChange}
    //      />
    //      <span className="highlight"></span>
    //      <span className="bar"></span>
    //      <label>Confirm Password</label>
    //    </div>
    //    <button type="submit" className="button buttonBlue">
    //      Submit
    //      <div className="ripples buttonRipples">
    //        <span className="ripplesCircle"></span>
    //      </div>
    //    </button>
    //    <p className="footer">
    //      Already have an account? <Link to={"/"}>Login</Link>
    //    </p>
    //  </form>
  );
}
