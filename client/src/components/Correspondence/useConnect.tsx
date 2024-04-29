import { useEffect, useState } from "react"
import { jwkDecrypt } from "../../Functions/Encode"
import { messageLocalStorageName } from "../../config"
import { SocketEmmiter } from "../Emitter/SocketEmitter"
import { randomBytes } from "crypto"
import io from "socket.io-client"

export const useConnect = (token: string, userId: string | null) => {
  const [trigger, actTrigger] = useState<string>("")

  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const socket = io(
      `http://${window.document.location.hostname}:80?token=${token}&userId=${userId}`
    )
    socket.on(
      "messageForYou",
      async ({ id, message }: { id: string; message: any }) => {
        try {
          const privateKeyStorage = localStorage.getItem("private")
          if (!privateKeyStorage)
            return window.M.toast({ html: "Server Error" })

          const { privateKey } = await JSON.parse(privateKeyStorage)

          const decryptedMessage = await jwkDecrypt(privateKey, message)

          const messagesStorage = localStorage.getItem(messageLocalStorageName)
          if (!messagesStorage) {
            const newMessage = {
              [id]: [{ from: "parther", message: decryptedMessage }],
            }
            localStorage.setItem(
              messageLocalStorageName,
              JSON.stringify(newMessage)
            )
          } else {
            const messagesJSONed = JSON.parse(messagesStorage)
            const status = messagesJSONed.hasOwnProperty(id)
            if (status) {
              messagesJSONed[id].push({
                from: "parther",
                message: decryptedMessage,
              })
            } else {
              messagesJSONed[id] = [
                { from: "parther", message: decryptedMessage },
              ]
            }
            localStorage.setItem(
              messageLocalStorageName,
              JSON.stringify(messagesJSONed)
            )
          }
          actTrigger(randomBytes(1).toString("hex"))
        } catch (e) {
          console.log("E", e)
        }
      }
    )

    SocketEmmiter.on("sendMessage", (data) => {
      socket.emit("sendMessage", data)
    })

    SocketEmmiter.on("isOnline", (data) => {
      socket.on(
        `isOnline_${data.userId}`,
        ({ status }: { status: boolean }) => {
          setIsOnline(status)
        }
      )

      socket.emit(`isOnline`, data)

      socket.on("isOnline", (data: { status: boolean }) => {
        setIsOnline(data.status)
      })

      //
    })

    SocketEmmiter.on("disconnect", () => {
      socket.disconnect()
    })
  }, [token])

  return [trigger, isOnline]
}
