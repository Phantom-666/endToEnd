import React, { useContext, useState } from "react"
import { SocketEmmiter } from "../Emitter/SocketEmitter"
import axios from "axios"
import { importKey, getEncodeText } from "../../Functions/Encode"
import { messageLocalStorageName } from "../../config"
import AuthContext from "../../Contexts/AuthContext"

const Input = (params: { id: string; setMessagesFromStorage: any }) => {
  const [message, setMessage] = useState<string>("")

  const { token } = useContext(AuthContext)

  const submitMessage = async () => {
    try {
      if (!message) return window.M.toast({ html: "Enter message" })
      const publicKey = await axios.get(`/api/getpublickey/${params.id}`, {
        headers: { token },
      })

      const importedPublicKey = await importKey(
        JSON.parse(publicKey.data.publicKey),
        "encrypt"
      )
      const cypherText = await getEncodeText(message, importedPublicKey)
      SocketEmmiter.emit("sendMessage", { id: params.id, message: cypherText })
      const messagesStorage = localStorage.getItem(messageLocalStorageName)

      if (!messagesStorage) {
        const newMessage = {
          [params.id!]: [{ from: "you", message }],
        }
        localStorage.setItem(
          messageLocalStorageName,
          JSON.stringify(newMessage)
        )
      } else {
        const messagesJSONed = JSON.parse(messagesStorage)
        const status = messagesJSONed.hasOwnProperty(params.id)
        if (status) {
          messagesJSONed[params.id].push({
            from: "you",
            message,
          })
        } else {
          messagesJSONed[params.id] = [{ from: "you", message }]
        }
        localStorage.setItem(
          messageLocalStorageName,
          JSON.stringify(messagesJSONed)
        )
      }
      params.setMessagesFromStorage()
      setMessage("")
    } catch (e) {
      window.M.toast({ html: "Server Error" })
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitMessage()
    }
  }

  return (
    <div
      style={{
        bottom: "0",
        left: "0",
        right: "0",
        padding: "10px",
      }}
    >
      <div className="row">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button className="btn blue" onClick={submitMessage}>
          Submit
        </button>
      </div>
    </div>
  )
}

export default Input
