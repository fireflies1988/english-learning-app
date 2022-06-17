import "../styles/Dictionary.css";
import TextField from "@mui/material/TextField";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton from "@mui/material/IconButton";
import { useState, useRef } from "react";
import axios from "axios";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LoadingButton from "@mui/lab/LoadingButton";

function Dictionary() {
  const inputWordRef = useRef("");
  const [data, setData] = useState();
  const [audio, setAudio] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstLookUp, setFirstLookUp] = useState(true);

  async function dictionaryApi(word) {
    setLoading(() => true);
    try {
      // get the meanings of a word
      const response1 = await axios.get(
        `https://salty-earth-78071.herokuapp.com/meaning/?word=${word}`
      );
      setFirstLookUp(false);
      setData(response1.data);

      // get audio link
      const response2 = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setAudio(response2.data[0].phonetics[0].audio);
    } catch (error) {
      setFirstLookUp(false);
      setData();
      console.log(error);
    }
    setLoading(() => false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    dictionaryApi(inputWordRef.current.value);
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
          inputRef={inputWordRef}
          inputProps={{className: "my-font"}}
          InputLabelProps={{ className: "my-font" }}
        />

        <LoadingButton
          loading={loading}
          loadingPosition="start"
          variant="contained"
          color="success"
          type="submit"
          style={{ width: "130px" }}
          className="my-font"
        >
          Tìm kiếm
        </LoadingButton>
      </form>

      <h3 hidden={firstLookUp}>
        Kết quả tìm kiếm cho "{inputWordRef.current.value}"
      </h3>
      {data ? (
        <>
          <div className="result">
            <div class="phonetics">
              <div>
                <IconButton
                  aria-label="speaker"
                  onClick={() => playAudio(audio)}
                >
                  <VolumeUpIcon />
                </IconButton>

                <span>{data.result.ipa}</span>
              </div>

              <IconButton aria-label="favorites">
                <StarBorderIcon />
              </IconButton>
            </div>

            {data.result.meanings.length > 0 &&
              data.result.meanings.map((meaning) => (
                <div className="meaning" key={meaning.id}>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <b>{meaning.typeid.name}</b>
                  </div>
                  <div>{meaning.mean}</div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <p hidden={firstLookUp}>Không tìm thấy kết quả</p>
      )}
    </div>
  );
}

export default Dictionary;
