import React, { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import Question from "../components/Question";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import SetOfQuestions from "../components/SetOfQuestions";

function QuestionAdmin() {
  const { auth } = useContext(AuthContext);
  const [state, setState] = useState({
    setNameErrorText: "",
    errorMessage: "",
    successMessage: "",
    isLoading: true,
    isUpdating: false,
    isCreating: false,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [expand, setExpand] = useState();
  const [setsOfQuestions, setSetsOfQuestions] = useState();
  const [nestedExpand, setNestedExpand] = useState();

  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("This is a success message!", {
      variant,
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom",
      },
      className: "my-font",
    });
  };

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
                setsOfQuestions.map((set) => (
                  <Accordion expanded={expand === set.id} key={set.id}>
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon
                          onClick={() =>
                            setExpand(expand === set.id ? "" : set.id)
                          }
                        />
                      }
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Grid
                        container
                        spacing={1}
                        style={{ marginRight: "0.5rem" }}
                      >
                        <Grid item xs={12} md={8}>
                          <TextField
                            placeholder="Nhập tên bộ đề"
                            id={set.id}
                            value={set.name}
                            size="small"
                            variant="outlined"
                            fullWidth
                            inputProps={{ className: "my-font" }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={4}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <LoadingButton
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            color="success"
                            className="my-font"
                            size="small"
                            sx={{ width: "33.33%" }}
                          >
                            Lưu
                          </LoadingButton>
                          <LoadingButton
                            loadingPosition="start"
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            color="error"
                            sx={{ marginLeft: "0.25rem", width: "33.33%" }}
                            className="my-font"
                            size="small"
                          >
                            Xóa
                          </LoadingButton>
                          <LoadingButton
                            loadingPosition="start"
                            startIcon={<DoDisturbIcon />}
                            variant="outlined"
                            color="success"
                            sx={{ marginLeft: "0.25rem", width: "33.33%" }}
                            className="my-font"
                            size="small"
                          >
                            Hủy
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <SetOfQuestions setId={set.id} />

                      <LoadingButton
                        loading={state.isCreating}
                        loadingPosition="start"
                        variant="contained"
                        style={{ margin: "1rem 0 0 0" }}
                        color="success"
                        startIcon={<AddIcon />}
                        size="small"
                        className="my-font"
                      >
                        Thêm câu hỏi
                      </LoadingButton>
                    </AccordionDetails>
                  </Accordion>
                ))}

              <LoadingButton
                loading={state.isCreating}
                loadingPosition="start"
                variant="contained"
                style={{ margin: "1rem 0 0" }}
                color="success"
                startIcon={<AddIcon />}
                className="my-font"
                fullWidth
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
