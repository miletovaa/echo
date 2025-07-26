import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  const debounceTimeout: number = 200
  const [inputValue, setInputValue] = useState<string>("")
  const [outputValue, setOutputValue] = useState<string>("")

  const fetchOutput = async (value: string) => {
    try {
      const response = await fetch('https://burelli.xyz/api/exercises/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: value
        }),
      })

      const data = await response.json()
      return data.text || "ERROR IN API RESPONSE"
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleInputChange = useCallback(async (value: string) => {
    localStorage.setItem('inputValue', value)

    const output = await fetchOutput(value)
    setOutputValue(output)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue) {
        handleInputChange(inputValue)
      }
    }, debounceTimeout)

    return () => clearTimeout(timeout)
  }, [inputValue])

  useEffect(() => {
    const storedValue = localStorage.getItem('inputValue')
    if (storedValue) {
      setInputValue(storedValue)
    }
  }, [])

  return (
    <>
      <h1>Echo</h1>
      <div className="card">
        <h3>Input</h3>
        <input type="text" id="input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      </div>
      <div className="card">
        <h3>Output</h3>
        <input type="text" id="output" value={outputValue} readOnly />
      </div>
    </>
  )
}

export default App
