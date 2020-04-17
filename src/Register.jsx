import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginFetch } from './loginFetch.js'



function Register(props) {
    const [user, setUser] = useState({username: '', password: '', fullName: ''});
    const dispatch = useDispatch()


    const handleRegister = async event => {
        event.preventDefault()
        if (!user.username || !user.password) {
            alert("Please enter a valid username or password.")
            return
        }
        let data = new FormData()
        data.append('fullName', user.fullName)
        data.append('username', user.username.toLowerCase())
        data.append('password', user.password)
        let response = await fetch('/register', { method: 'POST', body: data });
        let body = await response.text();
        let parsed = JSON.parse(body)
        if (parsed.success) {
            alert("Register success.")
            let content = await loginFetch(user)
            if (content) {
                alert("logged in!")
                dispatch({type: "SET-USER", content})
                props.history.push('/')
            }
        } else {
            alert('Register failed.')
        }
    }
    return (
        <div className="middle">
            <div className="form-card">
                <div className="form-container">
                <h3>Register</h3>

                <form className="form-container" onSubmit={handleRegister}>
                        <input style={{width: '-webkit-fill-available', margin: '0 0 1em'}} className="textInput" type="text" value={user.fullName} placeholder="Full Name"
                        onChange={(event) => setUser({...user, fullName: event.target.value })}/>
                    <br/>
                    <input style={{width: '-webkit-fill-available', margin: '0 0 1em'}} className="textInput" type="text" value={user.username} placeholder="Username"
                        onChange={(event) => setUser({...user, username: event.target.value })}/>
                    <br/>
                        <input style={{width: '-webkit-fill-available', margin: '0 0 1em'}} className="textInput" type="password" value={user.password} placeholder="Password"
                        onChange={(event) => setUser({...user, password: event.target.value })}/>
                    <br></br>
                    <input className="CTA" type="submit"></input>
                </form>

                <div style={{marginTop: "1em"}}>Already a user? <Link to="/">Login</Link></div>
                </div>
            </div>
        </div>
    )
}

export default Register