import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import "../styles/Profile.css";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Password() {
  const { auth } = useContext(AuthContext);
  const [state, setState] = useState({
    newPasswordErrorText: "",
    errorMessage: "",
    successMessage: "",
    isUpdating: false,
    showPassword: false,
  });
  const [newPassword, setNewPassword] = useState("");

  function handleClickShowPassword() {
    setState({ ...state, showPassword: !state.showPassword });
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handleSubmit(e) {
    e.preventDefault();
    setState((state) => ({
      ...state,
      newPasswordErrorText: "",
      errorMessage: "",
      successMessage: "",
    }));

    if (!newPassword.trim()) {
      setState((state) => ({
        ...state,
        newPasswordErrorText: "Mật khẩu mới không được để trống!"
      }));
    } else {
      updatePassword();
    }
  }

  async function updatePassword() {
    setState((state) => ({
      ...state,
      isUpdating: true,
      successMessage: "",
      errorMessage: "",
    }));
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/user/changepassword",
        {
          password: newPassword
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );
      console.log(response.data);
      if (response.data.status === 200) {
        setState((state) => ({
          ...state,
          isUpdating: false,
          successMessage: "Đổi mật khẩu thành công",
        }));

        setNewPassword("");
      }
    } catch (err) {
      setState((state) => ({
        ...state,
        errorMessage: err,
        isUpdating: false,
      }));
    }
  }

  function handleCancel(event) {
    setState((state) => ({
      ...state,
      successMessage: "",
      errorMessage: "",
      newPasswordErrorText: "",
    }));
    setNewPassword("");
  }

  return (
    <>
      <h1 style={{ marginTop: "0px", color: "#3c3c3c" }}>Mật khẩu</h1>

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

      <form onSubmit={handleSubmit}>
        <FormControl
          sx={{ width: "25ch" }}
          variant="outlined"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <InputLabel htmlFor="outlined-adornment-password" className="my-font">
            Mật khẩu mới
          </InputLabel>
          <OutlinedInput
            helperText={state.passwordErrorText}
            id="outlined-adornment-password"
            type={state.showPassword ? "text" : "password"}
            name="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            inputProps={{ className: "my-font" }}
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
            label="NewPassword"
          />
        </FormControl>
        <FormHelperText error style={{
            textAlign: "right",
            fontSize: "small",
            fontWeight: "bold",
          }}>
          {state.newPasswordErrorText}
        </FormHelperText>

        <LoadingButton
          loading={state.isUpdating}
          loadingPosition="start"
          variant="contained"
          style={{ marginTop: "2rem", marginRight: "1rem" }}
          color="success"
          startIcon={<SaveIcon />}
          type="submit"
          className="my-font"
        >
          Đổi mật khẩu
        </LoadingButton>

        <Button
          variant="outlined"
          color="success"
          style={{ marginTop: "2rem" }}
          onClick={handleCancel}
          className="my-font"
        >
          Hủy
        </Button>
      </form>
    </>
  );
}

export default Password;
