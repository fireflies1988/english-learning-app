import { TextField } from "@mui/material";
import React from "react";

function WordArrangingQuestion() {
  return (
    <>
      <TextField
        style={{ width: "100%", marginTop: "1rem" }}
        type="text"
        id=""
        label="Nội dung câu hỏi"
        name="content"
        // value={}
        // onChange={}
        inputProps={{ className: "my-font" }}
        InputLabelProps={{ className: "my-font" }}
        size="small"
      />
      <TextField
        style={{ width: "100%", marginTop: "1rem" }}
        type="text"
        id=""
        label="Đáp án"
        name="Answer"
        // value={}
        // onChange={}
        inputProps={{ className: "my-font" }}
        InputLabelProps={{ className: "my-font" }}
        size="small"
      />
    </>
  );
}

export default WordArrangingQuestion;
