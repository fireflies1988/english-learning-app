import LoadingButton from "@mui/lab/LoadingButton";
import "../styles/Profile.css";
import {
  Alert,
  Button,
  CircularProgress,
  FormHelperText,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import SaveIcon from "@mui/icons-material/Save";

function Profile() {
  const { auth } = useContext(AuthContext);
  const [initialData, setInitialData] = useState({});
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
    isUpdating: false,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
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
      setData(() => ({
        email: response.data.email,
        firstName: response.data.firstname,
        lastName: response.data.lastname,
        avatar: response.data.avatar,
      }));
      setInitialData(() => ({ ...data }));
    } catch (err) {
      setState((state) => ({
        ...state,
        errorMessage: "Đã có lỗi xảy ra, vui lòng thử lại sau!\n" + err,
      }));
    }
    setState((state) => ({
      ...state,
      isLoading: false,
    }));
  }

  async function updateUserInfo({ firstName, lastName, avatar }) {
    setState((state) => ({
      ...state,
      isUpdating: true,
      successMessage: "",
      errorMessage: "",
    }));
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/user/update",
        {
          firstname: firstName,
          lastname: lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );
      setData(() => ({
        email: response.data.result.email,
        firstName: response.data.result.firstname,
        lastName: response.data.result.lastname,
        avatar: response.data.result.avatar,
      }));
      setInitialData(() => ({ ...data }));
      setState((state) => ({
        ...state,
        isUpdating: false,
        successMessage: "Cập nhật hồ sơ thành công",
      }));
    } catch (err) {
      setState((state) => ({
        ...state,
        errorMessage: err,
        isUpdating: false,
      }));
    }
  }

  useEffect(() => {
    if (auth.accessToken) {
      fetchUserInfo();
    }
  }, [auth]);

  function handleChange(event) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setState((state) => ({
      ...state,
      firstNameErrorText: "",
      lastNameErrorText: "",
      errorMessage: "",
      successMessage: "",
    }));

    let errors = 0;
    if (!data.firstName.trim()) {
      setState((state) => ({
        ...state,
        firstNameErrorText: "Tên không được bỏ trống!",
      }));
      errors++;
    }

    if (!data.lastName.trim()) {
      setState((state) => ({
        ...state,
        lastNameErrorText: "Họ không được bỏ trống!",
      }));
      errors++;
    }

    if (errors === 0) {
      updateUserInfo(data);
    }
  }

  function handleCancel(event) {
    setState((state) => ({
      ...state,
      successMessage: "",
      errorMessage: "",
    }));
    setData(initialData);
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
        <>
          <CircularProgress color="success" />
          <h5>{state.loadingText}</h5>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            style={{ width: "100%", marginTop: "1rem" }}
            type="email"
            id="outlined-error-helper-text"
            label="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            disabled
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
          <FormHelperText
            error
            style={{
              textAlign: "right",
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
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
          <FormHelperText
            error
            style={{
              textAlign: "right",
              fontSize: "small",
              fontWeight: "bold",
            }}
          >
            {state.lastNameErrorText}
          </FormHelperText>

          <LoadingButton
            loading={state.isUpdating}
            loadingPosition="start"
            variant="contained"
            style={{ marginTop: "2rem", marginRight: "1rem" }}
            color="success"
            startIcon={<SaveIcon />}
            type="submit"
          >
            Lưu thay đổi
          </LoadingButton>

          <Button
            variant="outlined"
            color="success"
            style={{ marginTop: "2rem" }}
            onClick={handleCancel}
          >
            Hủy
          </Button>
        </form>
      )}
    </>
  );
}

export default Profile;
