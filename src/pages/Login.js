import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../styles/Login.css";
import { Link, useLocation } from "react-router-dom";
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import AuthContext from "../context/AuthProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { createBrowserHistory } from "history";

function Login() {
  const history = createBrowserHistory();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: location.state?.email,
    password: location.state?.password,
  });
  const [state, setState] = useState({
    showPassword: false,
    emailErrorText: "",
    passwordErrorText: "",
    errorMessage: "",
    successMessage: location.state?.message,
    isLoading: false,
  });

  useEffect(() => {
    if (location.state) {
      history.replace(location.state, null);
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  }

  function handleClickShowPassword() {
    setState({ ...state, showPassword: !state.showPassword });
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function login(email, password) {
    setState((state) => ({
      ...state,
      isLoading: true,
    }));
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/user/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials: true
        }
      );
      if (response.data.accessToken != null) {
        const accessToken = response.data.accessToken;
        const tokenType = response.data.tokenType;
        let temp = {
          accessToken: accessToken,
          tokenType: tokenType,
          loggedIn: true,
        };
        localStorage.setItem("auth", JSON.stringify(temp));
        setAuth(temp);
      } else {
        setState((state) => ({
          ...state,
          errorMessage: "Email hoặc mật khẩu không đúng!",
        }));
      }
    } catch (err) {
      setState((state) => ({ ...state, errorMessage: err }));
    }
    setState((state) => ({
      ...state,
      isLoading: false,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setState((state) => ({
      ...state,
      emailErrorText: "",
      passwordErrorText: "",
      errorMessage: "",
      successMessage: ""
    }));

    let errors = 0;
    if (!credentials.email) {
      setState((state) => ({
        ...state,
        emailErrorText: "Email không hợp lệ!",
      }));
      errors++;
    }

    if (!credentials.password) {
      setState((state) => ({
        ...state,
        passwordErrorText: "Mật khẩu không được bỏ trống!",
      }));
      errors++;
    }

    if (errors === 0) {
      login(credentials.email, credentials.password);
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1 className="title">Fakelingo</h1>

        {state.errorMessage !== "" && (
          <Alert variant="standard" severity="error">
            {state.errorMessage}
          </Alert>
        )}
        {state.successMessage && (
          <Alert variant="standard" severity="success">
            {state.successMessage}
          </Alert>
        )}

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="email"
          id="outlined-error-helper-text"
          label="Email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
        />
        <FormHelperText error className="error-text">
          {state.emailErrorText}
        </FormHelperText>

        <FormControl
          sx={{ width: "25ch" }}
          variant="outlined"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Mật khẩu
          </InputLabel>
          <OutlinedInput
            helperText={state.passwordErrorText}
            id="outlined-adornment-password"
            type={state.showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <FormHelperText error className="error-text">
          {state.passwordErrorText}
        </FormHelperText>

        <LoadingButton
          loading={state.isLoading}
          loadingPosition="start"
          variant="contained"
          style={{ width: "100%", marginTop: "2.5rem" }}
          color="success"
          size="large"
          type="submit"
        >
          ĐĂNG NHẬP
        </LoadingButton>

        <div className="register">
          <span>Chưa có tài khoản?</span>
          <Link to="/register"> Đăng ký ngay</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
