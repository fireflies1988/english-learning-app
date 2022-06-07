import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Alert,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [state, setState] = useState({
    showPassword: false,
    emailErrorText: "",
    passwordErrorText: "",
    firstNameErrorText: "",
    lastNameErrorText: "",
    errorMessage: "",
    isLoading: false,
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }

  function handleClickShowPassword() {
    setState({ ...state, showPassword: !state.showPassword });
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function register({ email, password, firstName, lastName }) {
    setState((state) => ({
      ...state,
      isLoading: true,
    }));
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/user/register",
        {
          email: email,
          password: password,
          firstname: firstName,
          lastname: lastName,
          avatar: null,
        },
        {
          headers: { "Content-Type": "application/json " },
          // withCredentials: true
        }
      );
      console.log(response.data);
      if (response.data.code === 1) {
        navigate("/login", {
          state: {
            email: email,
            password: password,
            message: "Đã đăng ký thành công, đăng nhập ngay"
          }
        });
      } else {
        setState((state) => ({
          ...state,
          errorMessage: response.data.message,
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
      firstNameErrorText: "",
      lastNameErrorText: "",
      errorMessage: "",
      successMessage: "",
    }));

    let errors = 0;
    if (data.email === "") {
      setState((state) => ({
        ...state,
        emailErrorText: "Email không hợp lệ!",
      }));
      errors++;
    }

    if (data.password.trim().length === 0) {
      setState((state) => ({
        ...state,
        passwordErrorText: "Mật khẩu không được bỏ trống!",
      }));
      errors++;
    }

    if (data.firstName.trim().length === 0) {
      setState((state) => ({
        ...state,
        firstNameErrorText: "Tên không được bỏ trống!",
      }));
      errors++;
    }

    if (data.lastName.trim().length === 0) {
      setState((state) => ({
        ...state,
        lastNameErrorText: "Họ không được bỏ trống!",
      }));
      errors++;
    }

    if (errors === 0) {
      register(data);
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

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="email"
          id="outlined-error-helper-text"
          label="Email"
          name="email"
          value={data.email}
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
            value={state.password}
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

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="text"
          id="outlined-error-helper-text"
          label="Tên"
          name="firstName"
          value={data.firstName}
          onChange={handleChange}
        />
        <FormHelperText error className="error-text">
          {state.firstNameErrorText}
        </FormHelperText>

        <TextField
          style={{ width: "100%", marginTop: "1rem" }}
          type="text"
          id="outlined-error-helper-text"
          label="Họ"
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
        />
        <FormHelperText error className="error-text">
          {state.lastNameErrorText}
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
          ĐĂNG KÝ
        </LoadingButton>

        <div className="register">
          <span>Đã có tài khoản?</span>
          <Link to="/login"> Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
