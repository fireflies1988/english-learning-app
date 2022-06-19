import { TextField } from '@mui/material'
import React from 'react'

function ListeningQuestion() {
  return (
    <TextField
        style={{ width: "100%", marginTop: "1rem" }}
        type="text"
        id=""
        label="Nội dung nghe"
        name="content"
        // value={}
        // onChange={}
        inputProps={{ className: "my-font" }}
        InputLabelProps={{ className: "my-font" }}
        size="small"
      />
  )
}

export default ListeningQuestion