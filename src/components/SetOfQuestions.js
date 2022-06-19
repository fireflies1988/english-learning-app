import LoadingButton from "@mui/lab/LoadingButton";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import AuthContext from "../context/AuthProvider";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Questions from "./Questions";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import axios from "axios";

function SetOfQuestions({ set, setsOfQuestions, setSetsOfQuestions, index }) {
  const { auth } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [initialData, setInitialData] = useState(set);
  const [data, setData] = useState(set);
  const { enqueueSnackbar } = useSnackbar();

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

  async function updateSetOfQuestions({ id, name }) {
    setSaving((saving) => !saving);
    try {
      const response = await axios.post(
        "https://salty-earth-78071.herokuapp.com/setofquestion/update",
        {
          name: name,
          id: id,
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
        handleClickVariant("success", "Lưu thay đổi thành công");
      }
    } catch (err) {
      handleClickVariant("error", "Lưu thất bại, đã có lỗi xảy ra: " + err);
    }
    setSaving((saving) => !saving);
  }

  async function deleteSetOfQuestions() {
    setDeleting((deleting) => !deleting);
    try {
      const response = await axios.delete(
        "https://salty-earth-78071.herokuapp.com/setofquestion/",
        {
          id: set.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.tokenType + " " + auth.accessToken,
          },
        }
      );

      if (response.data.status === 200) {
        setSetsOfQuestions((setsOfQuestions) => [
          ...setsOfQuestions.slice(0, index),
          ...setsOfQuestions.slice(index + 1),
        ]);
        handleClickVariant("success", "Xóa bộ đề thành công");
      }
    } catch (err) {
      handleClickVariant("error", "Xóa bộ đề thất bại: " + err);
    }
    setDeleting((deleting) => !deleting);
  }

  return (
    <Accordion expanded={expanded}>
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            onClick={() => setExpanded((expanded) => !expanded)}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Grid container spacing={1} style={{ marginRight: "0.5rem" }}>
          <Grid item xs={12} md={8}>
            <TextField
              placeholder="Nhập tên bộ đề"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              size="small"
              variant="outlined"
              fullWidth
              inputProps={{ className: "my-font" }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            style={{ display: "flex", alignItems: "center" }}
          >
            <LoadingButton
              loading={saving}
              onClick={() => updateSetOfQuestions(data)}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              color="success"
              className="my-font"
              size="small"
              sx={{ width: "33.33%" }}
            >
              Lưu
            </LoadingButton>
            <LoadingButton
              loading={deleting}
              onClick={deleteSetOfQuestions}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              variant="contained"
              color="error"
              sx={{ marginLeft: "0.25rem", width: "33.33%" }}
              className="my-font"
              size="small"
            >
              Xóa
            </LoadingButton>
            <LoadingButton
              loadingPosition="start"
              startIcon={<DoDisturbIcon />}
              variant="outlined"
              color="success"
              sx={{ marginLeft: "0.25rem", width: "33.33%" }}
              className="my-font"
              size="small"
              onClick={() => setData(initialData)}
            >
              Hủy
            </LoadingButton>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Questions setId={set.id} />
      </AccordionDetails>
    </Accordion>
  );
}

export default SetOfQuestions;
