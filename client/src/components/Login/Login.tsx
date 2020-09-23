import React, {useState, Fragment, useEffect, useContext} from 'react'
import AuthContext from '../../Contexts/AuthContext'
import axios from 'axios'
export default () => {
  const [userLogin, setUserLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginState, setLoginState] = useState<boolean>(false)

  const {login} = useContext(AuthContext)

  const renderFailure = (message: string) => {
    window.M.toast({html: message})
    setPassword('')
  }

  const checkPassword = async (password: string) => {
    try {

      type ResponseType = { 
        data : {id : string, image : string, logUser : string, token : string}
        
      }
      const response:ResponseType = await axios.post('/api/checkPassword', {login : userLogin, password})
      return login(response.data.token, response.data.id, response.data.logUser, response.data.image)
    } catch (e) {
      renderFailure(e.response.data.message)
    }
  }

  useEffect(() => {
    if (password.length === 4) {
      checkPassword(password)
    }
  }, [password])

  const inputHandle = (e: any) => setPassword(password + e.target.name)

  const buttonGeneration = (): string[] => new Array(9).fill('')

  const returnButton = (i: number) => {
    const dimesions = '80px'

    const optins = {margin: '2px', width: dimesions, height: dimesions}
    return (
      <Fragment key={i}>
        <button
          className='btn'
          onClick={inputHandle}
          name={i.toString()}
          style={optins}
        >
          {i}
        </button>
        {i % 3 === 0 && <br />}
      </Fragment>
    )
  }

  const testLed = (count: number) =>
    password.length > count ? 'radio_button_checked ' : 'radio_button_unchecked'

  const radioGeneration = () => {
    return Array(4)
      .fill('')
      .map((r, i) => (
        <i key={i} className='material-icons'>
          {testLed(i)}
        </i>
      ))
  }

  const userLoginHandler = (e: any) => {
    setUserLogin(e.target.value)
  }

  return (
    <>
      <div className='center '>
        <br/>
        {loginState && <i onClick={() => setLoginState(false)} className="material-icons">call_missed</i>} 
        <h1>Login</h1>
        {!loginState ? (
          <div className='container'>
            <input type='text' onChange={userLoginHandler} value={userLogin} />
            <button className='btn' onClick={() => setLoginState(true)}>
              Submit
            </button>
          </div>
        ) : (
          <>
            {radioGeneration()} 
            <br />
            <br />
            {buttonGeneration().map((_, i) => returnButton(i + 1))}
          </>
        )}
      </div>
    </>
  )
}
