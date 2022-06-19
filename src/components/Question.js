import React, { useState } from 'react'
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ListeningQuestion from './ListeningQuestion';
import WordArrangingQuestion from './WordArrangingQuestion';

function Question(props) {
    // Reading, Listening, WordArranging
    const [questionType, setQuestionType] = useState(props.questionType);
    const [question, setQuestion] = useState();
  
    return (
      <>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" className="my-font" size="small">Dạng câu hỏi</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={questionType}
            label="Dạng câu hỏi"
            onChange={(e) => setQuestionType(e.target.value)}
            className="my-font"
            size="small"
          >
            <MenuItem value="Reading" className="my-font">Trắc nghiệm</MenuItem>
            <MenuItem value="Listening" className="my-font">Nghe</MenuItem>
            <MenuItem value="WordArranging" className="my-font">Sắp xếp từ</MenuItem>
          </Select>
        </FormControl>
  
        {questionType === "Reading" && <MultipleChoiceQuestion />}
        {questionType === "Listening" && <ListeningQuestion /> }
        {questionType === "WordArranging" && <WordArrangingQuestion />}

        <LoadingButton
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
        >
          Hủy
        </LoadingButton>
      </>
    );
  }

export default Question