import React from "react"
import { Fragment, useEffect, useState } from "react"

export const RadioPassword = ({ fun }: { fun: any }) => {
  const [password, setPassword] = useState<string>("")

  const inputHandle = (e: any) => setPassword(password + e.target.name)

  const returnButton = (i: number) => {
    const dimesions = "80px"

    const options = { margin: "2px", width: dimesions, height: dimesions }
    return (
      <Fragment key={i}>
        <button
          className="btn"
          onClick={inputHandle}
          name={i.toString()}
          style={options}
        >
          {i}
        </button>
        {i % 3 === 0 && <br />}
      </Fragment>
    )
  }

  const testLed = (count: number) =>
    password.length > count ? "radio_button_checked " : "radio_button_unchecked"

  const radioGeneration = () => {
    return Array(4)
      .fill("")
      .map((r, i) => (
        <i key={i} className="material-icons">
          {testLed(i)}
        </i>
      ))
  }

  const renderFailure = (message: string) => {
    window.M.toast({ html: message })
    setPassword("")
  }

  useEffect(() => {
    if (password.length === 4) {
      fun(password, renderFailure)
    }
  }, [password])

  const buttonGeneration = (): string[] => new Array(9).fill("")

  return (
    <>
      {radioGeneration()}
      <br />
      <br />
      {buttonGeneration().map((_, i) => returnButton(i + 1))}
    </>
  )
}
