import { styled } from "@mui/material/styles";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Test.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import "../styles/speech-bubble.css";
import axios from "axios";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 13,
  borderRadius: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#58cc02",
  },
}));

function Test() {
  const { setId } = useParams();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(false);
  const [state, setState] = useState({
    isLoading: true,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
    errorMessage: "",
  });
  const [questions, setQuestions] = useState();

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
      setQuestions(response.data.result);
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
    fetchQuestions();
  }, []);

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }} className="my-font">
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton aria-label="close" size="large" onClick={handleClickOpen}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <BorderLinearProgress variant="determinate" value={0} style={{ marginRight: "12px" }} />
        </Box>
      </div>

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
            height: "80vh",
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
              <main>
                <section className="multiple-choice-question">
                  <h2 className="question">This is the question content</h2>

                  <ToggleButtonGroup
                    orientation="vertical"
                    value={view}
                    exclusive
                    onChange={handleChange}
                    className="options"
                  >
                    <ToggleButton
                      value="list"
                      aria-label="list"
                      className="option my-font"
                    >
                      Kiểm tra
                    </ToggleButton>
                    <ToggleButton
                      value="module"
                      aria-label="module"
                      className="option my-font"
                    >
                      Kiểm tra
                    </ToggleButton>
                    <ToggleButton
                      value="quilt"
                      aria-label="quilt"
                      className="option my-font"
                    >
                      Kiểm tra
                    </ToggleButton>
                  </ToggleButtonGroup>
                </section>

                <section className="listening-question" hidden>
                  <h2 className="question">Nhập lại nội dung bạn vừa nghe</h2>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <IconButton aria-label="speaker" className="speaker">
                      <VolumeUpIcon />
                    </IconButton>
                  </div>

                  <TextField
                    id="outlined-basic"
                    label="Nhập bằng tiếng anh"
                    variant="outlined"
                    multiline
                    fullWidth
                    rows={5}
                    maxRows={5}
                    style={{ marginTop: "3rem" }}
                    inputProps={{ className: "my-font" }}
                    InputLabelProps={{ className: "my-font" }}
                  />
                </section>

                <section className="arranging-question" hidden>
                  <h2 className="question">Viết lại bằng tiếng anh</h2>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ maxWidth: "100px" }}>
                      <img src={require("../icons/fox_512.png")} alt="" />
                    </div>
                    <div class="speech-bubble">
                      <p>This is a simple CSS speech bubble.</p>
                    </div>
                  </div>
                  <div className="your-answer"></div>
                  <div className="word-picking">
                    <ToggleButton
                      value="check"
                      size="small"
                      disabled={selected}
                      onChange={() => {
                        setSelected(!selected);
                      }}
                    >
                      Word
                    </ToggleButton>
                  </div>
                </section>
              </main>

              <footer>
                <Container
                  maxWidth="md"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="success"
                    className="my-font"
                  >
                    Bỏ qua
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    className="my-font"
                  >
                    Kiểm tra
                  </Button>
                </Container>
              </footer>
            </>
          )}
        </>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="my-font">
          Bạn muốn dừng lại thật sao?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="my-font">
            Bạn sẽ mất tất cả tiến trình vừa rồi.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="my-font">
            Ở lại
          </Button>
          <Button
            onClick={() => navigate("learn")}
            autoFocus
            className="my-font"
          >
            Thoát
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Test;
