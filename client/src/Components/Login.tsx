import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
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

import { FIND_USER_QUERY } from "../Graphql/queries";
import { LOGIN_MUTATION } from "../Graphql/mutations";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  interface userState {
    email: string;
    password: string;
  }
  const [token, setToken] = useState<string | null>(null);
  const [userState, setUserState] = useState<userState>({
    email: "",
    password: "",
  });

  const [login, { data: loginData, error, called, reset }] =
    useMutation(LOGIN_MUTATION);

  // If user already has token, redirect to "/home"
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);
  const [findUser, { data }] = useLazyQuery(FIND_USER_QUERY);
  useEffect(() => {
    findUser({
      variables: {
        token,
      },
    });
  }, [findUser, token]);
  if (data?.findUser) navigate("/home");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    toast.success("Successfully Logged In");
    localStorage.setItem("email", userState.email);
    localStorage.setItem("token", loginData.login.token);

    // To avoid bugs
    setTimeout(() => {
      navigate("/home");
    }, 100);
  }
  if (called && error){
    toast.error(error?.message);
    reset();
  } 
  

  return (
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
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
