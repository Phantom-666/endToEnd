import React, {useContext, useEffect, useState} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import MainLayer from '../../Layers/MainLayer'
import AllUsers from '../AllUsers/AllUsers'
import Correspondence from '../Correspondence/Correspondence'
import Main from '../Main/Main'
import io from 'socket.io-client'
import {SocketEmmiter} from '../Emitter/SocketEmitter'
import AuthContext from '../../Contexts/AuthContext'
import {jwkDecrypt} from '../../Functions/Encode'
import {randomBytes} from 'crypto'

const messageLocalStorageName = 'messages'

type PropsType = {
  token: string | null
}

export default ({token}: PropsType) => {
  const {userId} = useContext(AuthContext)
  const [trigger, actTrigger] = useState<string>('')

  // ${window.document.location.host}:80
  useEffect(() => {
    const socket = io(`http://${window.document.location.host}:80?token=${token}&userId=${userId}`)
    socket.on(
      'messageForYou',
      async ({id, message}: {id: string; message: any}) => {
        try {
          const privateKeyStorage = localStorage.getItem('private')

          if (!privateKeyStorage) return window.M.toast({html: 'Server Error'})
          const {privateKey} = await JSON.parse(privateKeyStorage)
          const decryptedMessage = await jwkDecrypt(privateKey, message)
          console.log('decryptedMessage', decryptedMessage)
          const messagesStorage = localStorage.getItem(messageLocalStorageName)
          if (!messagesStorage) {
            const newMessage = {[id]: [{from : 'parther', message : decryptedMessage}]}
            localStorage.setItem(
              messageLocalStorageName,
              JSON.stringify(newMessage)
            )
          } else {
            const messagesJSONed = JSON.parse(messagesStorage)
            const status = messagesJSONed.hasOwnProperty(id)
            if (status) {
              messagesJSONed[id].push({from : 'parther', message : decryptedMessage})
            } else {
              messagesJSONed[id] = [{from : 'parther', message : decryptedMessage}]
            }
            localStorage.setItem(
              messageLocalStorageName,
              JSON.stringify(messagesJSONed)
            )
          }
          actTrigger(randomBytes(1).toString('hex'))
        } catch (e) {
          console.log('E', e)
        }
      }
    )

    SocketEmmiter.on('sendMessage', (data) => {
      socket.emit('sendMessage', data)
    })

    SocketEmmiter.on('disconnect', () => {
      socket.disconnect()
    })
  }, [token])

  type RedirectComponentType = {path: string}

  const RedirectComponent: React.FC<RedirectComponentType> = ({
    path,
    children,
  }) => (
    <Route exact path={path}>
      <MainLayer>{children}</MainLayer>
    </Route>
  )
  return (
    <>
      <Switch>
        <RedirectComponent path='/main'>
          <Main />
        </RedirectComponent>
        <RedirectComponent path='/allusers'>
          <AllUsers />
        </RedirectComponent>
        <RedirectComponent path='/correspondence/:id'>
          <Correspondence trigger={trigger} />
        </RedirectComponent>
        <Redirect to='/main' />
      </Switch>
    </>
  )
}
