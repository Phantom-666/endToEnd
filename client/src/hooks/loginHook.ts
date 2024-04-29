import { useState, useCallback, useEffect } from "react"
import { generateExportedKeys } from "../Functions/Encode"
import axios from "axios"
import { SocketEmmiter } from "../components/Emitter/SocketEmitter"
import { clearLocalStorageMessages } from "../Functions/ClearLocalStorage"

const storageName = "userData"
const PrivateName = "private"

export const AuthHook = () => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loginUser, setLoginUser] = useState<string | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)
  const [ready, setReady] = useState<boolean>(false)

  const generateNewKeys = useCallback(async (token) => {
    try {
      const privateKeyStorage = localStorage.getItem(PrivateName)
      if (!privateKeyStorage) {
        console.log("keys were generated")

        const { publicKey, privateKey } = await generateExportedKeys()
        await axios.post(
          "/api/setpublickey",
          { publicKey },
          {
            headers: {
              token,
            },
          }
        )
        localStorage.setItem(PrivateName, JSON.stringify({ privateKey }))
      }
    } catch (e) {
      console.log(e)
    }
  }, [])

  const login = useCallback(
    (jwt, id, logUser, image) => {
      setToken(jwt)
      setUserId(id)
      setLoginUser(logUser)
      setUserImage(image)
      generateNewKeys(jwt)
      localStorage.setItem(
        storageName,
        JSON.stringify({
          jwtToken: jwt,
          userId: id,
          login: logUser,
          image,
        })
      )
    },
    [generateNewKeys]
  )

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setLoginUser(null)
    setUserImage(null)
    SocketEmmiter.emit("disconnect")
    localStorage.removeItem(storageName)
    localStorage.removeItem(PrivateName)
    clearLocalStorageMessages()
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName)!)

    if (data && data.jwtToken) {
      // axios.defaults.headers.token = data.jwtToken
      login(data.jwtToken, data.userId, data.login, data.image)

      // generateNewKeys(data.jwtToken)
    }

    setReady(true)
  }, [login])

  return {
    login,
    logout,
    token,
    userId,
    ready,
    loginUser,
    userImage,
  }
}
