import React, {useContext, useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {importKey, getEncodeText} from '../../Functions/Encode'
import axios from 'axios'
import {SocketEmmiter} from '../Emitter/SocketEmitter'
import Axios from 'axios'
import {randomBytes} from 'crypto'
import Message from './Message'
const messageLocalStorageName = 'messages'


export default ({trigger} : {trigger:string}) => {
  const [nameParther, setNameParther] = useState('Loading...')
  const [message, setMessage] = useState<string>('')
  const [isOnline, setIsOnline] = useState(false)
  const [messages, setMessages] = useState([])
  const history = useHistory()
  type paramsType = {
    id: string
  }

  type NameType = {
    data: {
      name: string
    }
  }

  const checkOnline = async () => {
    try {
      const req = await axios.post('/api/checkonlineusers', {id: params.id})
      setIsOnline(req.data.status)
    } catch (e) {
      window.M.toast({html: 'Server Error'})
    }
  }

  useEffect(() => {
    checkOnline()
  }, [])


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
    setMessagesFromStorage()
  }, [trigger])

  const params: paramsType = useParams()
  const takeCorrespondence = async () => {
    try {
      const {data}: NameType = await axios.get(
        `/api/correspondence/${params.id}`
      )
      setNameParther(data.name)
    } catch (e) {
      window.M.toast({html: 'Server Error'})
      history.push('/main')
    }
  }

  useEffect(() => {
    takeCorrespondence()
  }, [])

  const messageHandler = (e: any) => setMessage(e.target.value)
  const fail = (e: string) => window.M.toast({html: e})

  const submitMessage = async () => {
    try {
      if (!message) return fail('Enter message')
      const publicKey = await Axios.get(`/api/getpublickey/${params.id}`)
      const importedPublicKey = await importKey(
        JSON.parse(publicKey.data.publicKey),
        'encrypt'
      )
      const cypherText = await getEncodeText(message, importedPublicKey)
      SocketEmmiter.emit('sendMessage', {id: params.id, message: cypherText})
      const messagesStorage = localStorage.getItem(messageLocalStorageName)

      if (!messagesStorage) {
        const newMessage = {[params.id!]: [{from : 'you', message}]}
        localStorage.setItem(
          messageLocalStorageName,
          JSON.stringify(newMessage)
        )
      } 
      else {
        const messagesJSONed = JSON.parse(messagesStorage)
        const status = messagesJSONed.hasOwnProperty(params.id)
        if (status) {
          messagesJSONed[params.id].push({from : 'you', message})
        } else {
          messagesJSONed[params.id] = [{from : 'you', message}]
        }
        localStorage.setItem(
          messageLocalStorageName,
          JSON.stringify(messagesJSONed)
        )
      }
      setMessagesFromStorage()
      setMessage('')
    } catch (e) {
      fail('Server Error')
    }
  }

  const input = () => {
    return (
      <div
        className='center'
        style={{position: 'absolute', bottom: 0, right: '5px', left: '5px'}}
      >
        <input type='text' value={message} onChange={messageHandler} />
        <button className='btn' onClick={submitMessage}>
          Submit
        </button>
      </div>
    )
  }

  return (
    <>
      <div className='center'>
        <h6>
          {nameParther} : ${isOnline ? 'online' : 'offline'}
          <br />
          <br />

          {messages.map((m : {message : string, from : string }) => <Message key={randomBytes(2).toString('hex')} message={m.message} from={m.from} />)}
          {isOnline && input()}
        </h6>
      </div>
    </>
  )
}
