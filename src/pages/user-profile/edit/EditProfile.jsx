import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Route, Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
> form > * {
    margin: 1em 0 1em 0;
}
`

const PFP = styled.img`
width:50px;
height: 50px;
border-radius:50%;
`

const Row = styled.div`
display:flex;
align-items:center;
`

const Row2 = styled.div`
display:flex;
flex-direction:column;
@media screen and (min-width: 990px) {
    flex-direction:row;
    }
`

const PFPButton = styled.button`
border:none;
background-color:unset;
color:#8d02ff;
`

const PFPContainer = styled.div`
width:60px;
height:60px;
border-radius: 50%;
background: #fbfbfb;
box-shadow:  5px 5px 10px #e2e2e2, 
             -5px -5px 10px #f7f7f7;
margin-right: .7em;
display:flex;
align-items:center;
justify-content:center;

@media screen and (min-width: 990px) {
margin-right: 0;
}
`

const Aside = styled.aside`
/* padding-left:1em;
padding-right:1em; */
z-index:1;
margin-bottom:.5em;
@media screen and (min-width: 990px) {
    padding: 0 2em 0 2em;
    width: 100px;
    display: flex;
    justify-content: flex-end;
    }
`

const Input = styled.input`
width: fill-available;
`

const Textarea = styled.textarea`
width: fill-available;
height:100px;
resize:none;
font-family:sans-serif;
padding: 1em .5em 1em .5em;
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
        width: 100px;
    }
`

function EditProfile(props) {
    const [profile, setProfile] = useState({
        file: [],
        fullName: props.user.fullName,
        username: props.user.username,
        bio: props.user.profileDescription
    })
    const dispatch = useDispatch()

const handlePFPClick = event => {
    event.preventDefault()
    document.getElementById('file').click()
}

const handlePFP = event => {
    setProfile({...profile, file:[...event.target.files]})
}

const handleName = e => {
    setProfile({...profile, fullName: event.target.value})
}

const handleUsername = e => {
    setProfile({...profile, username: event.target.value})
}

const handleBio = e => {
    setProfile({...profile, bio: event.target.value})
}

const handleSubmit = async e => {
    e.preventDefault()
    if (!profile.fullName || !profile.username || !profile.bio) {
        alert("Please complete/modify a field.")
        return
    }
    if (profile.fullName === props.user.fullName && profile.username === props.user.username && profile.bio === props.user.profileDescription && !profile.file) {
        alert("No Changes have been made.")
        return
    }
    let data = new FormData()
    data.append('image', profile.file[0])
    data.append('fullName', profile.fullName)
    data.append('username', profile.username.toLowerCase())
    data.append('bio', profile.bio)
    data.append('oldPFP', props.user.profilePicture)
    let response = await fetch('/profile/edit', {method: 'POST', body: data})
    let body = await response.text()
    let parsed = JSON.parse(body)
    if (parsed.success) {
        dispatch({ type: 'SET-USER', content: parsed.user });
        alert('Updated profile!')

        let response2 = await fetch('/get/users-chat', {method: 'GET'})
        let body2 = await response2.text()
        let parsed2 = JSON.parse(body2)
        if (parsed2.success) {
            dispatch({ type: 'GET-USERS', content: parsed2.allUsers })
            dispatch({ type: 'GET-CHATS', content: parsed2.matchingChats })
        }

        props.history.push('/profile/' + profile.username.toLowerCase())
    }

}

    return (
        <Container className="container" style={{alignItems:'unset'}}>
            <form onSubmit={handleSubmit}>
            <Row>
                <Aside>
                    <PFPContainer><PFP src={props.user.profilePicture}/></PFPContainer>
                </Aside>
                <div style={{width:'100%'}}>
                    <div>@{props.user.username}</div>
                    <PFPButton onClick={handlePFPClick}>Change profile picture</PFPButton>
                        <input type="file" id="file" onChange={handlePFP} style={{visibility: 'hidden', width:'0', display:'none'}} accept="image/*"/>

                </div>
            </Row>
            <Row2>
                <Aside>
                    <strong>Name</strong>
                </Aside>
                <div style={{width:'100%'}}><Input className="textInput" type="text" value={profile.fullName} onChange={handleName}></Input></div>
            </Row2>
            <Row2>
                <Aside>
                    <strong>Username</strong>
                </Aside>
                <div style={{width:'100%'}}><Input className="textInput" type="text" value={profile.username} onChange={handleUsername}></Input></div>
            </Row2>
            <Row2>
                <Aside>
                    <strong>Bio</strong>
                </Aside>
                <div style={{width:'100%'}}><Textarea className="textInput" type="text" value={profile.bio} onChange={handleBio}></Textarea></div>
            </Row2>
            <div style={{display: 'flex', justifyContent:'center'}}><Button type="submit">Submit</Button></div>
            </form>
            <div style={{margin: '0 auto'}}><Link  to="/account/password">Change my password</Link></div>
        </Container>        
    )
}

export default EditProfile