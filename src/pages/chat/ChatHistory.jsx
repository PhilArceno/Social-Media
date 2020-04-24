import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ChatApp from './ChatApp.jsx'

const Search = styled.input`
width:95%;
margin-top:1em;
margin-bottom:1em;

`

const Block = styled.div`
width:95%;
`

const OneResult = styled.div`
margin:.5em 0 .5em 0;
padding: .5em;
display:flex;
align-items:center;
border-radius:5px;


:hover {
    cursor: pointer;
    background-color:#f1f1f1;
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
    background-color:white;
    box-shadow:  3px 3px 4px #c9c9c9, 
             -3px -3px 4px #f7f7f7;

> img{
    border-radius:50%;
    width:34px;
    height:34px;
}
`

const Exit = styled.div`
    position: fixed;
    top: .2em;
    right: .5em;
    font-size:1.5em;
    cursor:pointer;
    z-index:102;
    color:#B2B2B2;
`

const ModalWrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items:center;
    position: fixed;
    left: 0;
    top: 0;
    -webkit-overflow-scrolling: touch;
    padding: 1em 0 1em 0;
    width: 100%;
    background-color: white;
    height: 100vh;
    z-index:101;

@media screen and (min-width: 990px) {
    width: 100vw;
    height: ${props => props.user ? '89vh' : '100vh'};
    /* backdrop-filter: blur(1px); */
    /* background-color: rgba(0,0,0,0.2); */
}
`

function ChatHistory(props) {
    const [search, setSearch] = useState({input:''})
    const [openChat, setOpenChat] = useState({clicked:false, info:[]})


    useEffect(() => {
    }, [props.chatLog])

    const searchUsers = e => {
        let string = e.target.value
        let special = string.match(/^[^a-zA-Z0-9^\s]+$/g)
        if (special) return
        setSearch({...search, input: e.target.value })
    }

    const renderChat = (thisChat, oneUser) => {
        if (thisChat) {
                    setOpenChat({...openChat, clicked:true, info: {thisChat, oneUser}})
        } else {
            setOpenChat({...openChat, clicked:true, info: {thisChat: {_id: undefined}, oneUser}})
        }
    }

    return (
        <div className="container">
            <Search type="text" className="textInput" onChange={searchUsers} value={search.input} placeholder="Search"></Search>
            
            {/* map message history */}
            {!search.input && props && props.chatLog && props.user && props.allUsers ? <Block>
                {props.chatLog.map(thisChat => {
                    if (thisChat.messages.length < 1) return
                    return props.user.chatIds.map(thisId => {
                        if (thisId === thisChat._id) {
                            return thisChat.users.map(checkUser => {
                                if (checkUser !== props.user.username) {
                                    return props.allUsers.map((oneUser, index) => {
                                        if (oneUser.username === checkUser) {
                                            return <OneResult key={index} onClick={()=>{renderChat(thisChat, oneUser)}}>
                                                <PFPContainer><img src={oneUser.profilePicture}></img></PFPContainer>
                                                <div>
                                                    <div>{oneUser.fullName}</div>
                                                    <div style={{color: 'grey'}}>
                                                        {thisChat.messages[thisChat.messages.length - 1].text.length > 20 ? 
                                                            thisChat.messages[thisChat.messages.length - 1].text.slice(0, 20) + '...' : thisChat.messages[thisChat.messages.length - 1].text}
                                                    </div>
                                                </div>
                                            </OneResult>
                                        }
                                    })
                                }
                            })
                        }
                    })
                })}
            </Block> : ''}
            
            {/* search user list */}
            {search.input ? <Block>
                {props.allUsers ? props.allUsers.map((oneUser, index) => {
                    if (oneUser.username !== props.user.username && (oneUser.username.toLowerCase().match(search.input.toLowerCase()) || oneUser.fullName.toLowerCase().match(search.input.toLowerCase()))) {
                    return props.chatLog.map(thisChat => {
                        if ((props.user.username === thisChat.users[0] || props.user.username === thisChat.users[1]) 
                        && (oneUser.username === thisChat.users[0] || oneUser.username === thisChat.users[1]) ) {
                            return(
                            <OneResult key={index} onClick={()=> {renderChat( thisChat,oneUser)}}>
                                <PFPContainer><img src={oneUser.profilePicture}></img></PFPContainer>
                                <div>
                                    <div>{oneUser.fullName}</div>
                                    <div style={{color: 'grey'}}>@{oneUser.username}</div>
                                </div>
                            </OneResult>)                            
                        }
                    })
                }
                }): ''}
            </Block> : '' }
            {openChat.clicked && openChat.info ? <div>
                <Exit onClick={()=>{setOpenChat({...openChat, clicked:false, info: []})}}>&#10006;</Exit>
                <ModalWrapper role="button" onClick={ ()=>{
                    setOpenChat({...openChat, clicked:false, info: []})
                    setSearch({input: ''})
                    }}>  
                    <ChatApp user={props.user} chatId={openChat.info.thisChat._id} user2={openChat.info.oneUser}/>
                </ModalWrapper>
                </div> : ''}
        </div>
    )
}

export { ChatHistory }