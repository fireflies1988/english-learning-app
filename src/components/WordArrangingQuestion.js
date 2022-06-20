import { TextField } from "@mui/material";
import React, { useState } from "react";

function WordArrangingQuestion({ question, setQuestion }) {
  function handleChange(event) {
    const { name, value } = event.target;
    setQuestion({ ...question, [name]: value });
  }

  return (
    <>
      <TextField
        style={{ width: "100%", marginTop: "1rem" }}
        type="text"
        id=""
        label="Nội dung câu hỏi"
        name="questcontent"
        value={question.questcontent}
        onChange={handleChange}
        inputProps={{ className: "my-font" }}
        InputLabelProps={{ className: "my-font" }}
        size="small"
      />
      <TextField
        style={{ width: "100%", marginTop: "1rem" }}
        type="text"
        id=""
        label="Đáp án"
        name="answer"
        value={question.answer}
        onChange={handleChange}
        inputProps={{ className: "my-font" }}
        InputLabelProps={{ className: "my-font" }}
        size="small"
      />
    </>
  );
}

export default WordArrangingQuestion;
