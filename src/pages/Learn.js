import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Learn() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [data, setData] = useState();
  const [state, setState] = useState({
    isLoading: true,
    loadingText: "Đang lấy dữ liệu, vui lòng chờ...",
    errorMessage: "",
  });

  async function fetchSetsOfQuestions() {
    try {
      const response = await axios.get(
        "https://salty-earth-78071.herokuapp.com/setofquestion/get",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );
      setData(response.data.result);
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
      fetchSetsOfQuestions();
    }
  }, [auth]);

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "80px" }}>
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
            <Grid container spacing={2}>
              {data.length > 0 &&
                data.map((set) => (
                  <Grid item xs={6} md={4} key={set.id}>
                    <Card
                      style={{
                        backgroundColor: set.score === 10 ? "#ffff00" : "#fff",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{
                            fontFamily: "'Fira Sans', sans-serif",
                            fontWeight: "bold",
                          }}
                          color="rgb(60, 60, 60)"
                        >
                          {set.name}
                        </Typography>
                        <Typography
                          sx={{
                            mb: 1.5,
                            fontFamily: "'Fira Sans', sans-serif",
                          }}
                          color="#ff6f00"
                        >
                          <b>Điểm: {set.score ?? "chưa thi"}</b>
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          style={{
                            width: "100%",
                            fontFamily: "'Fira Sans', sans-serif",
                            backgroundColor: "rgb(5 255 252)",
                            color: "black",
                          }}
                          onClick={() => navigate(`/learn/${set.id}`)}
                        >
                          {!set.score ? "Thi" : "Thi lại"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}

export default Learn;
