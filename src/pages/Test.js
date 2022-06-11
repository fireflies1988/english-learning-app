import { styled } from "@mui/material/styles";
import {
  Container,
  IconButton,
  LinearProgress,
  linearProgressClasses,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
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

  return (
    <Container maxWidth="md" style={{ marginTop: "2.25rem" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton aria-label="close" size="large">
          <CloseIcon fontSize="inherit" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <BorderLinearProgress variant="determinate" value={50} />
        </Box>
      </div>
    </Container>
  );
}

export default Test;
