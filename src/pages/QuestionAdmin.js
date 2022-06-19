import React, { useContext, useEffect, useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import SetOfQuestions from "../components/SetOfQuestions";
import { useSnackbar } from "notistack";

function QuestionAdmin() {
  const { auth } = useContext(AuthContext);
  const [state, setState] = useState({
    errorMessage: "",
    successMessage: "",
    isLoading: true,
    isUpdating: false,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
  });
  const [creating, setCreating] = useState(false);
  const [setsOfQuestions, setSetsOfQuestions] = useState();
  const { enqueueSnackbar } = useSnackbar();

  function handleClickVariant(variant, message) {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom",
      },
      className: "my-font",
    });
  }

  async function fetchAllSetsOfQuestions() {
    try {
      const response = await axios.get(
        "https://salty-earth-78071.herokuapp.com/setofquestion/all",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );
      setSetsOfQuestions(response.data.result);
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

  async function createNewSetOfQuestions() {
    setCreating((creating) => !creating);
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/setofquestion/new",
        {
          name: "This is default name",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );

      if (response.data.status === 200) {
        setSetsOfQuestions((setSetsOfQuestions) => [
          ...setsOfQuestions,
          response.data.result,
        ]);
        handleClickVariant("success", "Thêm bộ đề thành công");
      }
    } catch (err) {
      handleClickVariant("error", "Thêm thất bại: " + err);
    }
    setCreating((creating) => !creating);
  }

  useEffect(() => {
    if (auth.accessToken) {
      fetchAllSetsOfQuestions();
    }
  }, [auth]);

  return (
    <>
      <h1 style={{ marginTop: "0px", color: "#3c3c3c" }}>Quản trị đề thi</h1>

      {state.errorMessage !== "" && (
        <Alert variant="standard" severity="error">
          {state.errorMessage}
        </Alert>
      )}

      {state.isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "75vh",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress color="success" />
          </div>
          <h4 style={{ textAlign: "center" }}>{state.loadingText}</h4>
        </div>
      ) : (
        <>
          {!state.errorMessage && (
            <>
              {setsOfQuestions?.length > 0 &&
                setsOfQuestions.map((set, index) => (
                  <SetOfQuestions
                    set={set}
                    key={set.id}
                    setsOfQuestions={setsOfQuestions}
                    setSetsOfQuestions={setSetsOfQuestions}
                    index={index}
                  />
                ))}

              <LoadingButton
                loading={creating}
                loadingPosition="start"
                variant="contained"
                style={{ margin: "1rem 0 0" }}
                color="success"
                startIcon={<AddIcon />}
                className="my-font"
                fullWidth
                onClick={createNewSetOfQuestions}
              >
                Thêm bộ đề
              </LoadingButton>
            </>
          )}
        </>
      )}
    </>
  );
}

export default QuestionAdmin;
