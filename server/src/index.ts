import {app, server, serverHttps} from './socket/socket'
import express from 'express'
import cors from 'cors'
import {connect} from 'mongoose'
import {resolve} from 'path'
const httpPort = 80
const httpsPort = 443
const mongoDb =
  'mongodb+srv://Vadim:zxcvvcxz166@cluster0-uk8of.mongodb.net/test?retryWrites=true&w=majority'


app.use(cors())

app.use(express.json())
app.use(
  '/api',
  require('./routes/checkPassword'),
  require('./routes/allUsers'),
  require('./routes/correspondence'),
  require('./routes/PublicKey'),
  require('./routes/checkOnlineUsers')
)

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.protocol === 'http')
      return res.redirect(`https://${req.hostname}:443`)
    next()
  })
  app.use(
    '/',
    express.static(resolve(__dirname, '..', '..', 'client', 'build'))
  )
  app.get('*', (req, res) => {
    res.sendFile(
      resolve(__dirname, '..', '..', 'client', 'build', 'index.html')
    )
  })
}




const startServer = (httpPort: number, httpsPort: number) => {
  
  serverHttps.listen(httpsPort, () =>
      console.log(`Server is starting on HTTPS port : ${httpsPort}`)
    )
  server.listen(httpPort, () => console.log(`Server started ${httpPort}`))
  connect(
    mongoDb,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => {
      console.log('>DB connect is success...')
    }
  )
}

startServer(httpPort, httpsPort)
