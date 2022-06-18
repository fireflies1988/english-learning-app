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
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Test.css";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import "../styles/speech-bubble.css";
import axios from "axios";
import { useSpeechSynthesis } from "react-speech-kit";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import AuthContext from "../context/AuthProvider";

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

const WordPicking = memo(
  ({ currentQuestion, handleSelectWord, shuffledWords, setShuffledWords }) => {
    function shuffleArray(array) {
      console.log("shuffleArray is firing");
      for (var i = array?.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }

      return array;
    }

    const temp = useMemo(
      () =>
        shuffleArray(currentQuestion.answer?.split(/ +/))?.map(
          (word, index) => ({
            key: index,
            value: word,
            disabled: false,
          })
        ),
      [currentQuestion]
    );

    useEffect(() => {
      setShuffledWords(temp);
    }, [temp]);

    return (
      <div className="word-picking">
        {currentQuestion.answer &&
          shuffledWords?.map((word) => (
            <ToggleButton
              key={word.key}
              value={word.value}
              disabled={word.disabled}
              size="small"
              className="my-font"
              onClick={() => handleSelectWord(word)}
            >
              {word.value}
            </ToggleButton>
          ))}
      </div>
    );
  }
);

function Test() {
  const { auth } = useContext(AuthContext);
  const { speak } = useSpeechSynthesis();
  const { setId } = useParams();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoading: true,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
    errorMessage: "",
  });
  // question
  const [questions, setQuestions] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numOfCorrectAnswers, setNumOfCorrectAnswers] = useState(0);

  // word arranging question
  const [pickedWords, setPickedWords] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);

  // multiple choice question
  const [option, setOption] = useState();

  // listening question
  const [yourListeningAnswer, setYourListeningAnswer] = useState("");

  // this state has one of four values: unanswered, correct, incorrect, completed
  const [footerState, setFooterState] = useState("unanswered");
  const [correctAnswer, setCorrectAnswer] = useState("");

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
      setCurrentQuestion(() => response.data.result[0]);
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

  // multiple choice question
  const handleChange = (event, option) => {
    setOption(option);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /// arranging question
  function handleSelectWord(word) {
    // disable the button in the choosing section after clicking
    setShuffledWords((shuffledWords) => [
      ...shuffledWords.slice(0, word.key),
      { ...shuffledWords[word.key], disabled: true },
      ...shuffledWords.slice(word.key + 1),
    ]);

    // add the button to the answer section
    setPickedWords((pickedWords) => [...pickedWords, word]);
  }
  function handleDeselectWord(word, index) {
    // remove the button from the answer section after clicking
    setPickedWords((pickedWords) => [
      ...pickedWords.slice(0, index),
      ...pickedWords.slice(index + 1),
    ]);

    // enable the button in the choosing section after clicking
    setShuffledWords((shuffledWords) => [
      ...shuffledWords.slice(0, word.key),
      { ...shuffledWords[word.key], disabled: false },
      ...shuffledWords.slice(word.key + 1),
    ]);
  }

  function checkAnswer() {
    let questionType = currentQuestion.typeid.name;
    if (questionType === "Listening") {
      console.log("---Listening question---");
      setCorrectAnswer(currentQuestion.questcontent);
      if (!yourListeningAnswer) {
        setFooterState("incorrect");
      } else {
        let words = currentQuestion.questcontent
          .toLowerCase()
          .trim()
          .split(/\s+/);
        console.info(words);
        let yourWords = yourListeningAnswer.toLowerCase().trim().split(/\s+/);
        console.info(yourWords);

        let maxNumOfMatchedWords = Math.max(words.length, yourWords.length);
        let numOfMatchedWords = 0;
        for (let i = 0; i < Math.min(words.length, yourWords.length); i++) {
          let maxNumOfMatchedChars = Math.max(
            words[i].length,
            yourWords[i].length
          );
          let numOfMatchedChars = 0;
          for (
            let j = 0;
            j < Math.min(words[i].length, yourWords[i].length);
            j++
          ) {
            if (words[i].charAt(j) === yourWords[i].charAt(j)) {
              numOfMatchedChars++;
            }
          }

          // check if the pair of words approximately matched
          let rate = numOfMatchedChars / maxNumOfMatchedChars;
          console.log("checkAnswer: " + rate);
          if (rate > 0.7) {
            numOfMatchedWords++;
          }
        }

        let rate = numOfMatchedWords / maxNumOfMatchedWords;
        console.log("checkAnswer - result: " + rate);
        if (rate > 0.7) {
          setFooterState("correct");
          setNumOfCorrectAnswers((score) => score + 1);
        } else {
          setFooterState("incorrect");
        }
      }
    } else if (questionType === "Reading") {
      console.log("---Multiple question---");
      setCorrectAnswer(currentQuestion.answer);
      if (option?.toLowerCase() === currentQuestion.answer.toLowerCase()) {
        setFooterState("correct");
        setNumOfCorrectAnswers((score) => score + 1);
      } else {
        setFooterState("incorrect");
      }
    } else if (questionType === "Arrange") {
      console.log("---Multiple question---");
      setCorrectAnswer(currentQuestion.answer);
      let yourAnswer = pickedWords.map((pw) => pw.value).join(" ");
      console.log(yourAnswer);
      let answer = currentQuestion.answer.trim().replaceAll(/\s+/g, " ");
      console.log(answer);

      if (yourAnswer === answer) {
        setFooterState("correct");
        setNumOfCorrectAnswers(
          (numOfCorrectAnswers) => numOfCorrectAnswers + 1
        );
      } else {
        setFooterState("incorrect");
      }
    }
  }
  console.log("Number of correct answers: " + numOfCorrectAnswers);
  console.log("Index: " + currentIndex);

  function dismiss() {
    let questionType = currentQuestion.typeid.name;
    if (questionType === "Listening") {
      setCorrectAnswer(currentQuestion.questcontent);
    } else {
      setCorrectAnswer(currentQuestion.answer);
    }
    setFooterState("incorrect");
  }

  function handleClickContinue() {
    // reset states
    setYourListeningAnswer("");
    setPickedWords([]);
    setOption();

    if (currentIndex + 1 < questions.length) {
      setFooterState("unanswered");
      setCurrentQuestion(questions[currentIndex + 1]);
      setCurrentIndex((currentIndex) => currentIndex + 1);
    } else {
      setFooterState("completed");
      updateScore();
    }
  }

  async function updateScore() {
    setState((state) => ({
      ...state,
      isLoading: true,
      loadingText: "Đang tính điểm, vui lòng chờ...",
    }));
    try {
      const response = await axios.post(
        `https://salty-earth-78071.herokuapp.com/score/new`,
        {
          setid: setId,
          score: (numOfCorrectAnswers / questions.length) * 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      setState((state) => ({
        ...state,
        errorMessage: "Đã có lỗi xảy ra, vui lòng thử lại sau!\n" + err,
      }));
    }
    setState((state) => ({
      ...state,
      isLoading: false,
      loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
    }));
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem" }} className="my-font">
      {footerState !== "completed" && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton aria-label="close" size="large" onClick={handleClickOpen}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <BorderLinearProgress
              variant="determinate"
              value={0}
              style={{ marginRight: "12px" }}
            />
          </Box>
        </div>
      )}

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
                {footerState !== "completed" ? (
                  <>
                    <section
                      className="multiple-choice-question"
                      hidden={currentQuestion.typeid.name !== "Reading"}
                    >
                      <h2 className="question">
                        {currentQuestion.questcontent}
                      </h2>

                      <ToggleButtonGroup
                        orientation="vertical"
                        value={option}
                        exclusive
                        onChange={handleChange}
                        className="options"
                      >
                        <ToggleButton
                          value="A"
                          aria-label="A"
                          className="option my-font"
                        >
                          {currentQuestion.a}
                        </ToggleButton>
                        <ToggleButton
                          value="B"
                          aria-label="B"
                          className="option my-font"
                        >
                          {currentQuestion.b}
                        </ToggleButton>
                        <ToggleButton
                          value="C"
                          aria-label="C"
                          className="option my-font"
                        >
                          {currentQuestion.c}
                        </ToggleButton>
                        <ToggleButton
                          value="D"
                          aria-label="D"
                          className="option my-font"
                        >
                          {currentQuestion.d}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </section>

                    <section
                      className="listening-question"
                      hidden={currentQuestion.typeid.name !== "Listening"}
                    >
                      <h2 className="question">
                        Nhập lại nội dung bạn vừa nghe
                      </h2>

                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <IconButton
                          aria-label="speaker"
                          className="speaker"
                          onClick={() =>
                            speak({ text: currentQuestion.questcontent })
                          }
                        >
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
                        value={yourListeningAnswer}
                        onChange={(e) => setYourListeningAnswer(e.target.value)}
                      />
                    </section>

                    <section
                      className="arranging-question"
                      hidden={currentQuestion.typeid.name !== "Arrange"}
                    >
                      <h2 className="question">Viết lại bằng tiếng anh</h2>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <div style={{ maxWidth: "100px" }}>
                          <img src={require("../icons/fox_512.png")} alt="" />
                        </div>
                        <div class="speech-bubble">
                          <p>{currentQuestion.questcontent}</p>
                        </div>
                      </div>
                      <div className="your-answer">
                        {pickedWords.map((word, index) => (
                          <ToggleButton
                            key={word.key}
                            value={word.value}
                            aria-label={word.value}
                            className="my-font"
                            size="small"
                            selected="true"
                            onClick={() => handleDeselectWord(word, index)}
                          >
                            {word.value}
                          </ToggleButton>
                        ))}
                      </div>
                      <WordPicking
                        currentQuestion={currentQuestion}
                        handleSelectWord={handleSelectWord}
                        shuffledWords={shuffledWords}
                        setShuffledWords={setShuffledWords}
                      />
                    </section>
                  </>
                ) : (
                  <section style={{ width: "unset" }}>
                    <div
                      style={{
                        maxWidth: "400px",
                        display: "flex",
                        justifyContent: "center",
                        height: "75vh",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ maxWidth: "220px", margin: "0 auto" }}>
                        <img
                          src={require("../icons/badge_512.png")}
                          alt=""
                          style={{ width: "100%" }}
                        />
                      </div>

                      <h2
                        style={{
                          textAlign: "center",
                          color: "rgb(60, 60, 60)",
                        }}
                      >
                        Xin chúc mừng bạn đã hoàn thành bài học
                      </h2>
                      <h3
                        style={{
                          textAlign: "center",
                          color: "#ffc400",
                          marginBottom: "0",
                        }}
                      >
                        Bạn trả lời đúng: {numOfCorrectAnswers}/
                        {questions.length}
                      </h3>
                      <h3 style={{ textAlign: "center", color: "#ffc400" }}>
                        Điểm của bạn:{" "}
                        {(numOfCorrectAnswers / questions.length) * 100}
                      </h3>
                    </div>
                  </section>
                )}
              </main>

              <footer
                className="test-footer"
                style={{
                  backgroundColor:
                    footerState === "unanswered"
                      ? "white"
                      : footerState === "incorrect"
                      ? "#ffdfe0"
                      : footerState === "correct"
                      ? "#d7ffb8"
                      : "white",
                }}
              >
                {footerState === "unanswered" && (
                  <Container maxWidth="md" className="f-container">
                    <Button
                      variant="outlined"
                      color="success"
                      className="my-font continue-button"
                      onClick={dismiss}
                    >
                      Bỏ qua
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      className="my-font continue-button"
                      onClick={checkAnswer}
                    >
                      Kiểm tra
                    </Button>
                  </Container>
                )}
                {footerState === "incorrect" && (
                  <Container maxWidth="md" className="f-container">
                    <div className="content">
                      <div className="image-content">
                        <img
                          src={require("../icons/incorrect_512.png")}
                          alt=""
                        />
                      </div>

                      <div className="answer-content">
                        <div className="group-1">
                          <h3>Đáp án đúng là:</h3>
                          <div>{correctAnswer}</div>
                        </div>

                        <Button
                          variant="text"
                          color="error"
                          className="my-font"
                        >
                          <EmojiFlagsIcon />
                          Báo cáo
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      color="error"
                      className="my-font continue-button"
                      onClick={handleClickContinue}
                    >
                      Tiếp tục
                    </Button>
                  </Container>
                )}
                {footerState === "correct" && (
                  <Container maxWidth="md" className="f-container">
                    <div className="content">
                      <div className="image-content">
                        <img src={require("../icons/correct_512.png")} alt="" />
                      </div>

                      <div className="answer-content">
                        <div className="group-1" style={{ color: "#2e7d32" }}>
                          <h3>Đúng rồi, giỏi lắm!</h3>
                          <div>{correctAnswer}</div>
                        </div>

                        <Button
                          variant="text"
                          color="success"
                          className="my-font"
                        >
                          <EmojiFlagsIcon />
                          Báo cáo
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      color="success"
                      className="my-font continue-button"
                      onClick={handleClickContinue}
                    >
                      Tiếp tục
                    </Button>
                  </Container>
                )}
                {footerState === "completed" && (
                  <Container maxWidth="md" className="f-container">
                    <Button
                      variant="contained"
                      color="success"
                      className="my-font continue-button"
                      onClick={() => navigate("learn")}
                    >
                      Tiếp tục
                    </Button>
                  </Container>
                )}
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
