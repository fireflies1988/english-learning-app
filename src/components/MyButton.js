import React from 'react'
import "../styles/MyButton.css"

function MyButton({ children }) {
  return (
    <button class="my-button">{children}</button>
  )
}

export default MyButton