import React, { useContext } from 'react'
import Navbar from '../components/Navbar/Navbar'
import AuthContext from '../Contexts/AuthContext'


const MainLayer:React.FC = (props) => {
    const {loginUser} = useContext(AuthContext)
    return (
        <>
        <Navbar  name={loginUser!} />
        {props.children}
        </>
    )
}

export default MainLayer