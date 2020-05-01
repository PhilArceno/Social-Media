import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
position:fixed;
top:0;
height:100%;
width:100%;
padding:0;
display:flex;
flex-direction:column;
justify-content:space-between;
`
const TopBar = styled.div`
height:75px;
box-shadow: 8px 8px 16px #f1f1f1, 
         -8px -8px 16px #f7f7f7;
width:100%;

display:flex;
align-items:center;

> a{
    display:flex;
align-items:center;
}

`

const PFPContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:50%;
    width:42px;
    height:42px;
    margin-right: 1em;
    margin-left: .5em;

    background-color:white;
    box-shadow:  3px 3px 4px #c9c9c9, 
             -3px -3px 4px #f7f7f7;

> img{
    border-radius:50%;
    width:34px;
    height:34px;
}
`

const Messages = styled.div`
    height: 100%;
    width: fill-available;
    padding: 0 1em;
    overflow:auto;
`

const InputContainer = styled.div`
width:100%;

> form {
    margin:1em;
}

> form > input {
    width: fill-available;
}
`

const SingleMessage = styled.div`
    border-radius:10px;
    color: ${props => props.user ? 'white' : 'black'};
    background-color: ${props => props.user ? '#8d02ff' : 'lightgrey'};
    width: fit-content;
    padding: .5em;
    margin-left: ${props => props.user ? 'auto' : ''};
    margin-top:.3em;
`

function ChatApp(props) {
    const messagesEndRef  = useRef()
    const chatLog = useSelector(state => state.chatLog)
    const [message, setMessage] = useState({input: ''})
    const [thisChat, setThisChat] = useState({})
    const dispatch = useDispatch()
    const [firstTime, setFirstTime] = useState({ check: true})

    useEffect(() => {
        let getChat = chatLog.filter(chat => {
            return chat._id === props.chatId
        })
        getChat = getChat[0]
        setThisChat(getChat)
        setTimeout(()=> {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }, 200)
    }, [chatLog, props.chatId])

    const sendMessage = async e => {
        e.preventDefault()
        if (!message.input) return
        let data = new FormData()
        data.append('newMessage', message.input)
        data.append('chatId', props.chatId)
        let response = await fetch('/chat/send-message', {method: 'POST', body: data})
        let body = await response.text()
        let parsed = await JSON.parse(body)
        if (parsed.success) {
            dispatch({ type: 'GET-CHATS', content: parsed.matchingChats })
        }
        setMessage({...message, input: ''})
        scrollToBottom();
    }

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" })
      }

    const handleInput = e => {
        setMessage({...message, input: e.target.value})
    }
    

    return (
        <Container className="container" onClick={e => e.stopPropagation()}>
            <TopBar>
                <Link to={'/profile/' + props.user2.username}>
                    <PFPContainer>
                        <img src={props.user2.profilePicture}/>
                    </PFPContainer>
                    <div>
                        {props.user2.fullName} 
                    </div>
                </Link>
            </TopBar>
            <Messages>
            {thisChat && thisChat.messages ? thisChat.messages.map((message, index) => {
                if (message.username === props.user2.username) {
                    return <SingleMessage key={index}>{message.text}</SingleMessage>
                }
                if (message.username === props.user.username) {
                    return <SingleMessage key={index} user={props.user}>{message.text}</SingleMessage>
                }
            }) : ''}
            <div ref={messagesEndRef}></div>
            </Messages>
            <InputContainer>
            <form onSubmit={sendMessage}>
                <input className='textInput' type='text' onChange={handleInput} value={message.input}></input>
                <input type="submit" style={{display:'none'}}></input>
            </form>
            </InputContainer>
        </Container>
    )
}

export default ChatApp