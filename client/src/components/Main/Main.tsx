import React, { useContext, useEffect, useState } from "react"
import { randomBytes } from "crypto"
import Items from "./Items"
import axios from "axios"
import AuthContext from "../../Contexts/AuthContext"

export default () => {
  const [messages, setMessages] = useState<{ name: string; id: string }[]>([])

  const { token } = useContext(AuthContext)

  const fetchChats = async () => {
    const m = localStorage.getItem("messages") || "{}"

    const localMessages = Object.keys(JSON.parse(m))

    const chats = await axios.post(
      "/api/chats",
      { users: localMessages },
      { headers: { token } }
    )

    const result = []

    for (let i = 0; i < chats.data.chats.length; i++) {
      const name: string = chats.data.chats[i]

      result.push({ name, id: localMessages[i] })
    }

    setMessages(result)
  }

  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <>
      <ul className="collection">
        {messages.map((m: any) => {
          const id = randomBytes(4).toString("hex")
          return <Items key={id} {...m} />
        })}
      </ul>
    </>
  )
}
