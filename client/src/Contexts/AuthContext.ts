import {createContext} from 'react'

type AuthContextType = {
  login : (jwt: string, id: string, logUser: string, image: string) => void,
  logout : () => void,
  token : string | null,
  userId : string | null,
  loginUser : string | null,
  userImage : string | null,
}

export default createContext({} as AuthContextType)
