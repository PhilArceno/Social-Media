import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginFetch } from './loginFetch.js'

function Login(props) {
    const [user, setUser] = useState({username: '', password: ''});
    const dispatch = useDispatch()

    const handleLogin = async event => {
        event.preventDefault()
        if (!user.username || !user.password) {
            alert("Please enter a valid username or password.")
            return
        }
        let content = await loginFetch(user)
        if (content) {
            alert("logged in!")
            dispatch({type: "SET-USER", content})
            props.history.push('/')
        } else {
            alert("failed to log in.")
        }
    }

    return (
        <div className="middle">
        <div className="form-card">
            <div className="form-container">
            <h3>Login</h3>

            <form onSubmit={handleLogin}>
                    <input style={{width: '-webkit-fill-available', margin: '0 0 1em'}} className="textInput" type="text" value={user.username} placeholder="Username"
                    onChange={(event) => setUser({...user, username: event.target.value })}/>
                <br/>
                    <input style={{width: '-webkit-fill-available', margin: '0 0 1em'}} className="textInput" type="password" value={user.password} placeholder="Password"
                    onChange={(event) => setUser({...user, password: event.target.value })}/>
                <br></br>
                <input className="CTA" type="submit"></input>
            </form>

            <div style={{marginTop: "1em"}}>Sign up now! <Link to="/signup">Register</Link></div>
            </div>
        </div>
        </div>
    )
}

export default Login