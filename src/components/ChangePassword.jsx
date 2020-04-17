import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Route, Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
> form > * {
    margin: 1em 0 1em 0;
}
`

const Row = styled.div`


@media screen and (min-width: 990px) {
    display:flex;
    align-items:center;
    justify-content: space-between;
}
`

const Row2 = styled.div`
    display:flex;
    flex-direction:column;
    width: 100%%;

@media screen and (min-width: 990px) {
    width:49%;
}
`

const Aside = styled.aside`
z-index:1;
margin-bottom:.5em;

`

const Input = styled.input`
width: fill-available;
`

const Button = styled.button`
cursor:pointer;
    border-radius: 5px;
    border: none;
    padding: 1em;
    background-color: #8d02ff;
    color: white;
    box-shadow: 5px 5px 10px #e2e2e2, -5px -5px 10px #f7f7f7;
    width:100%;
    max-width:600px;

    @media only screen and (min-width: 990px) {
        margin: 0 auto;
        width: 100px;
    }
`

function EditProfile(props) {
    const [profile, setProfile] = useState({
        password: '',
        passwordConfirm: ''
    })

    useEffect(() => {
    }, [])

const handlePassword = e => {
    setProfile({...profile, password: event.target.value})
}

const handlePassword2 = e => {
    setProfile({...profile, passwordConfirm: event.target.value})
}

const handleSubmit = async e => {
    e.preventDefault()
    if (profile.password !== profile.passwordConfirm) {
        alert('Passwords do not match!')
        return
    }
    let data = new FormData()
    data.append('newPassword', profile.password)
    let response = await fetch('/edit/password', {method: 'POST', body: data})
    let body = await response.text()
    let parsed = JSON.parse(body)
    if (parsed.success) {
        alert('Password Changed!')
        return
    }
}

    return (
        <Container className="container" style={{alignItems:'unset'}}>
            <form onSubmit={handleSubmit}>
            <Row>
                <Row2>
                    <Aside>
                        <strong>Change Password</strong>
                    </Aside>
                    <div><Input className="textInput" type="password" value={profile.password} onChange={handlePassword}></Input></div>
                </Row2>
                <Row2>
                    <Aside>
                        <strong>Confirm Password</strong>
                    </Aside>
                    <div><Input className="textInput" type="password" value={profile.passwordConfirm} onChange={handlePassword2}></Input></div>
                </Row2>
            </Row>
            <div style={{display: 'flex', justifyContent:'center'}}><Button type="submit">Submit</Button></div>
            </form>
            <div style={{margin: '0 auto'}}><Link  to="/account/edit">Edit Profile</Link></div>
        </Container>        
    )
}

export default EditProfile