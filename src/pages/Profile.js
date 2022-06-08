import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, Button, CircularProgress, FormHelperText, TextField } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import "../styles/Profile.css";

function Profile() {
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    avatar: null,
  });
  const [state, setState] = useState({
    firstNameErrorText: "",
    lastNameErrorText: "",
    errorMessage: "",
    successMessage: "",
    isLoading: true,
  });

  async function fetchUserInfo() {
    try {
      const response = await axios.get(
        "https://salty-earth-78071.herokuapp.com/user/get",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );
      console.log(response.data);
      setData({
        email: response.data.email,
        firstName: response.data.firstname,
        lastName: response.data.lastname,
      });
      setState((state) => ({
        ...state,
        isLoading: false,
      }));
    } catch (err) {
      setState((state) => ({
        ...state,
        errorMessage: err,
      }));
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }

  return (
    <>
      <h1 style={{ marginTop: "0px", color: "#3c3c3c" }}>Hồ sơ</h1>

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

      {state.isLoading ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="email"
            id="outlined-error-helper-text"
            label="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />

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
            style={{ marginTop: "2rem", marginRight: "1rem" }}
            color="success"
            type="submit"
          >
            Lưu thay đổi
          </LoadingButton>

          <Button
            variant="outlined"
            color="success"
            style={{ marginTop: "2rem" }}
          >
            Hủy
          </Button>
        </>
      )}
    </>
  );
}

export default Profile;
