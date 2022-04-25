import "../styles/Dictionary.css";
import TextField from "@mui/material/TextField";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function Dictionary() {
  const [word, setWord] = useState("");
  const [data, setData] = useState([]);
  const [audio, setAudio] = useState("");

  async function dictionaryApi() {
    try {
      const response1 = await axios.get(
        `https://salty-earth-78071.herokuapp.com/meaning/?word=${word}`
      );
      setData(response1.data);

      const response2 = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setAudio(response2.data[0].phonetics[0].audio);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    dictionaryApi();
  }

  function playAudio(url) {
    let audio = new Audio(url);
    audio.play();
  }

  return (
    <div className="dictionary">
      <h2>Từ điển Anh - Việt</h2>

      <form onSubmit={handleSubmit}>
        <TextField
          type="search"
          id="standard-basic"
          label="Nhập từ cần tra"
          variant="standard"
          style={{ width: "36vw" }}
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />

        <Button variant="contained" color="success" type="submit">
          Tìm kiếm
        </Button>
      </form>

      {data.length > 0 && (
        <>
          <h3>Kết quả tìm kiếm cho {word}</h3>

          <div className="result">
            <div class="phonetics">
              <div>
                <IconButton
                  aria-label="speaker"
                  onClick={() => playAudio(audio)}
                >
                  <VolumeUpIcon />
                </IconButton>

                <span>{data[0].ipa}</span>
              </div>

              <IconButton aria-label="favorites">
                <StarBorderIcon />
              </IconButton>
            </div>

            {data[0].meanings.length > 0 &&
              data[0].meanings.map((meaning) => (
                <div className="meaning" key={meaning.id}>
                  <div>
                    <b>Danh từ</b>
                  </div>
                  {meaning.mean}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dictionary;
