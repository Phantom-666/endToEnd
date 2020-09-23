import React from 'react'


type PropsType = {
    message : string,
    from : string
}

export default ({message, from}: PropsType) => {

    if (from === 'you') {
        return (
        <p> {message} : YOU</p>
        )
    } 


    if (from === 'parther') {
        return (
            <p >PARTHER: {message} </p>
        )
    }

    else return null
}