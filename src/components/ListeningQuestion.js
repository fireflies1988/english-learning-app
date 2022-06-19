import { TextField } from "@mui/material";
import React, { useState } from "react";

function ListeningQuestion({ question }) {
  const [updatedQuestion, setUpdatedQuestion] = useState(question);
  function handleChange(event) {
    const { name, value } = event.target;
    setUpdatedQuestion({ ...updatedQuestion, [name]: value });
  }

  return (
    <TextField
      style={{ width: "100%", marginTop: "1rem" }}
      type="text"
      id=""
      label="Nội dung nghe"
      name="questcontent"
      value={updatedQuestion.questcontent}
      onChange={handleChange}
      inputProps={{ className: "my-font" }}
      InputLabelProps={{ className: "my-font" }}
      size="small"
    />
  );
}

export default ListeningQuestion;
