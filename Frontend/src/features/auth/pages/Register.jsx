import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

const Register = () => {

  const navigate = useNavigate()

  const {loading, handleRegister} = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRegister({username, email, password})
    navigate('/')
  }

  if(loading){
    return (
      <main>
      <h1>Loading....</h1>
    </main>
    )
  }

  
  return (
    <main>
      <div className='form-container'>
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor='username '>Username</label>
            <input 
            onChange={(e) => {setUsername(e.target.value)}}
            type='text' name='username' id='username' placeholder='Enter username'/>
          </div>

          <div className="input-group">
            <label htmlFor='email'>Email</label>
            <input 
            onChange={(e) => {setEmail(e.target.value)}}
            type='email' name='email' id='email' placeholder='Enter email'/>
          </div>

          <div className="input-group">
            <label 
            onChange={(e) => {setPassword(e.target.value)}}
            htmlFor='password'>Password</label>
            <input type='password' name='password' id='password' placeholder='Enter password'/>
          </div>

          <button type='submit' className='button primary-button' >SignUp</button>

        </form>

        <p>Already have an account? <Link to={"/login"}>Login</Link></p>

      </div>
    </main>
  )
}

export default Register
