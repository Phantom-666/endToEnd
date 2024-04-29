import React from "react"

export default function Message(msg: { from: string; message: string }) {
  return (
    <div
      className={`message ${msg.from === "you" ? "from-you" : "from-other"}`}
    >
      <p className="font-roboto">{msg.message}</p>
    </div>
  )
}
