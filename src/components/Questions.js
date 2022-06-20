import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Question from "./Question";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../context/AuthProvider";
import { useSnackbar } from "notistack";

function Questions({ setId }) {
  const [questions, setQuestions] = useState();
  const [state, setState] = useState({
    isLoading: true,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
    errorMessage: "",
  });
  const [creating, setCreating] = useState(false);
  const { auth } = useContext(AuthContext);
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

  async function fetchQuestions() {
    try {
      const response = await axios.get(
        `https://salty-earth-78071.herokuapp.com/question/getbyset?set=${setId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setQuestions(() => response.data.result);
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

  async function createNewQuestion() {
    setCreating((creating) => !creating);
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/question/update",
        {
          questcontent: "",
          a: "",
          b: "",
          c: "",
          d: "",
          answer: "",
          typeid: 5,
          setid: setId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );

      if (response.data.status === 200) {
        setQuestions((questions) => [...questions, response.data.result]);
        handleClickVariant("success", "Thêm câu hỏi thành công");
      }
    } catch (err) {
      handleClickVariant("error", "Thêm câu hỏi thất bại thất bại: " + err);
    }
    setCreating((creating) => !creating);
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
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
            height: "150px",
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
              {questions?.length > 0 ? (
                questions?.map((question, index) => (
                  <Accordion key={question.id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className="my-font">
                        Câu hỏi {index + 1}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Question
                        question={question}
                        setQuestions={setQuestions}
                        index={index}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <h3>Đề này chưa có câu hỏi nào!</h3>
              )}
            </>
          )}
        </>
      )}
      <LoadingButton
        loading={creating}
        onClick={createNewQuestion}
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
    </>
  );
}

export default Questions;
