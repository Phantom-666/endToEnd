import React, {useState} from 'react'
import {randomBytes} from 'crypto'
import Items from './Items'


export default () => {
  const [messages, setMessages] = useState<string[]>([])

  return (
    <>
      <ul className='collection'>
        {messages.map((m: any) => {
          const id = randomBytes(4).toString('hex')
          return <Items key={id} {...m} />
        })}
      </ul>
    </>
  )
}
