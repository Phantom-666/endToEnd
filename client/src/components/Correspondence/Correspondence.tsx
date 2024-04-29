import React, { useEffect, useRef, useState, useContext } from "react"
import { useParams, useHistory } from "react-router-dom"
import axios from "axios"
import Message from "./Message"
import "./Correspondence.css"
import AuthContext from "../../Contexts/AuthContext"
import Input from "./Input"
import { NameType, paramsType } from "./types"
import { useConnect } from "./useConnect"
import { SocketEmmiter } from "../Emitter/SocketEmitter"
import { messageLocalStorageName } from "../../config"

export default ({ token }: { token: string }) => {
  const [namePartner, setNamePartner] = useState("Loading...")
  const [partnerImage, setPartnerImage] = useState("")

  const [messages, setMessages] = useState([])
  const history = useHistory()

  // Our partner id
  const params: paramsType = useParams()

  const { userId } = useContext(AuthContext)

  const [trigger, isOnline] = useConnect(token, userId)

  useEffect(() => {
    SocketEmmiter.emit("isOnline", { userId: params.id })
  }, [params.id])

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 1000)
  }

  const setMessagesFromStorage = () => {
    const messages = localStorage.getItem(messageLocalStorageName)
    if (messages) {
      const messagesWithSpecificPerson = JSON.parse(messages)[params.id]
      if (messagesWithSpecificPerson) {
        setMessages(messagesWithSpecificPerson)
      }
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [])

  useEffect(() => {
    setMessagesFromStorage()
  }, [trigger])

  const takeCorrespondence = async () => {
    try {
      const { data }: NameType = await axios.get(
        `/api/correspondence/${params.id}`,
        { headers: { token } }
      )

      setNamePartner(data.name)
      setPartnerImage(data.image)
    } catch (e) {
      window.M.toast({ html: "Server Error" })
      history.push("/main")
    }
  }

  useEffect(() => {
    takeCorrespondence()
  }, [])

  const deleteChat = () => {
    const messages = localStorage.getItem(messageLocalStorageName)

    if (messages) {
      const parsed = JSON.parse(messages)

      const messagesWithSpecificPerson = parsed[params.id]
      if (messagesWithSpecificPerson) {
        parsed[params.id] = []

        localStorage.setItem(messageLocalStorageName, JSON.stringify(parsed))

        setMessages([])
      }
    }
  }

  return (
    <>
      <div className="container">
        <div className="main">
          <div className="main-header">
            <div
              className="avatar"
              style={{ backgroundImage: `url(${partnerImage})` }}
            ></div>
            <h2>{namePartner}</h2>
            <button className="btn red" onClick={deleteChat}>
              Delete chat
            </button>
          </div>
          <div className="message-container">
            {messages.map((msg: { message: string; from: string }, i) => (
              <Message {...msg} key={i} />
            ))}
          </div>
          <div className="container">
            <div className="center">
              {isOnline && (
                <Input
                  id={params.id}
                  setMessagesFromStorage={setMessagesFromStorage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div style={{ float: "left", clear: "both" }} ref={messagesEndRef}></div>
    </>
  )
}
