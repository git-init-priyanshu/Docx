import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { SIGNUP_MUTATION } from "../Graphql/mutations";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();

  type inputType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm_password: string;
  };

  const inputSchema: ZodType<inputType> = z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(5).max(10),
      confirm_password: z.string().min(5).max(10),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Password and Confirm Password do not match",
      path: ["confirm_password"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<inputType>({
    resolver: zodResolver(inputSchema),
  });

  const [email, setEmail] = useState<string | null>(null);

  const [signup, { data: signupData, error, called, reset }] =
    useMutation(SIGNUP_MUTATION);

  const submitData = async (data: inputType) => {
    setEmail(data.email);
    signup({
      variables: {
        data: {
          emailId: data.email,
          password: data.password,
        },
      },
    });
  };
  if (signupData?.signup.success) {
    toast.success("Successfully Signed Up");
    localStorage.setItem("email", email!);
    localStorage.setItem("token", signupData.signup.token);

    // To avoid bugs
    setTimeout(() => {
      navigate("/home");
    }, 100);
  }
  if (called && error) {
    navigate("/");
    window.alert(error.message);
    reset();
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitData)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                {...register("firstName")}
                error={errors.firstName ? true : false}
                helperText={errors.firstName && errors.firstName.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                autoComplete="family-name"
                {...register("lastName")}
                error={errors.lastName ? true : false}
                helperText={errors.lastName && errors.lastName.message}
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
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={errors.email ? true : false}
              helperText={errors.email && errors.email.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              {...register("password")}
              error={errors.password ? true : false}
              helperText={errors.password && errors.password.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="cPassword"
              {...register("confirm_password")}
              error={errors.confirm_password ? true : false}
              helperText={
                errors.confirm_password && errors.confirm_password.message
              }
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
  );
}
