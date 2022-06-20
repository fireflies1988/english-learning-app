import React, { useContext, useState } from "react";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ListeningQuestion from "./ListeningQuestion";
import WordArrangingQuestion from "./WordArrangingQuestion";
import { useSnackbar } from "notistack";
import axios from "axios";
import AuthContext from "../context/AuthProvider";

function Question({ question, setQuestions, index }) {
  // Reading, Listening, Arrange, Default
  const [questionType, setQuestionType] = useState(question?.typeid?.name);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState(question);
  const [data, setData] = useState(question);
  const { enqueueSnackbar } = useSnackbar();
  const { auth } = useContext(AuthContext);
  const [deleting, setDeleting] = useState(false);

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

  function getQuestionTypeValue() {
    if (questionType === "Listening") {
      return 1;
    } else if (questionType === "Reading") {
      return 2;
    } else if (questionType === "Arrange") {
      return 4;
    } else {
      return 5;
    }
  }

  function getQuestionType(id) {
    if (id === 1) {
      return "Listening";
    } else if (id === 2) {
      return "Reading";
    } else if (id === 4) {
      return "Arrange";
    } else {
      return "Default";
    }
  }

  async function updateQuestion() {
    setSaving((saving) => !saving);
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/question/update",
        {
          id: data.id,
          questcontent: data.questcontent,
          a: data.a,
          b: data.b,
          c: data.c,
          d: data.d,
          answer: data.answer,
          typeid: getQuestionTypeValue(),
          setid: data?.setid,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );

      if (response.data.status === 200) {
        setData(() => response.data.result);
        setInitialData(() => response.data.result);
        handleClickVariant("success", "Lưu câu hỏi thành công");
      }
      if (response.data.status === 500) {
        handleClickVariant("error", "Lưu câu hỏi thất bại");
      }
    } catch (err) {
      handleClickVariant("error", "Lưu câu hỏi thất bại: " + err);
    }
    setSaving((saving) => !saving);
  }

  async function deleteQuestion() {
    setDeleting((deleting) => !deleting);
    try {
      const response = await axios.delete(
        "https://salty-earth-78071.herokuapp.com/question/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
          data: {
            id: data.id,
          },
        }
      );

      if (response.data.status === 200) {
        setQuestions((questions) => [
          ...questions.slice(0, index),
          ...questions.slice(index + 1),
        ]);
        handleClickVariant("success", "Xóa câu hỏi thành công");
      } else {
        handleClickVariant("error", "Xóa câu hỏi thất bại")
      }
    } catch (err) {
      handleClickVariant("error", "Xóa câu hỏi thất bại: " + err);
    }
    setDeleting((deleting) => !deleting);
  }

  function handleCancel() {
    setData(initialData);
    setQuestionType(getQuestionType(initialData.typeid.id));
  }

  return (
    <>
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          className="my-font"
          size="small"
        >
          Dạng câu hỏi
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={questionType}
          label="Dạng câu hỏi"
          onChange={(e) => setQuestionType(e.target.value)}
          className="my-font"
          size="small"
        >
          <MenuItem value="Reading" className="my-font">
            Trắc nghiệm
          </MenuItem>
          <MenuItem value="Listening" className="my-font">
            Nghe
          </MenuItem>
          <MenuItem value="Arrange" className="my-font">
            Sắp xếp từ
          </MenuItem>
        </Select>
      </FormControl>

      {questionType === "Reading" && (
        <MultipleChoiceQuestion question={data} setQuestion={setData}/>
      )}
      {questionType === "Listening" && (
        <ListeningQuestion question={data} setQuestion={setData} />
      )}
      {questionType === "Arrange" && (
        <WordArrangingQuestion question={data} setQuestion={setData}/>
      )}

      <LoadingButton
        loading={saving}
        onClick={updateQuestion}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
        color="success"
        size="small"
        sx={{ marginTop: "1rem" }}
        className="my-font"
      >
        Lưu
      </LoadingButton>
      <LoadingButton
        loading={deleting}
        onClick={deleteQuestion}
        loadingPosition="start"
        startIcon={<DeleteIcon />}
        variant="contained"
        color="error"
        size="small"
        sx={{ marginTop: "1rem", marginLeft: "0.5rem" }}
        className="my-font"
      >
        Xóa
      </LoadingButton>
      <LoadingButton
        loadingPosition="start"
        startIcon={<DoDisturbIcon />}
        variant="outlined"
        color="success"
        size="small"
        sx={{ marginTop: "1rem", marginLeft: "0.5rem" }}
        className="my-font"
        onClick={handleCancel}
      >
        Hủy
      </LoadingButton>
    </>
  );
}

export default Question;
