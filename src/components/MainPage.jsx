import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Route, Link } from 'react-router-dom'
import Navigation from './Navigation.jsx'
import Feed from '../pages/feed/Feed.jsx'
import EditProfile from '../pages/user-profile/edit/EditProfile.jsx'
import ChangePassword from '../pages/user-profile/edit/ChangePassword.jsx'
import { ChatHistory } from '../pages/chat'
import EditPost from '../pages/user-profile/edit/EditPost.jsx'



function MainPage(props) {
    const allUsers = useSelector(state => state.allUsers)
    const chatLog = useSelector(state => state.chatLog)
    const dispatch = useDispatch()

    const gatherUsers = async () => {
        let response = await fetch('/get/users-comments', {method: 'GET'})
        let body = await response.text()
        let parsed = JSON.parse(body)
        if (parsed.success) {
            dispatch({ type: 'GET-USERS', content: parsed.allUsers })
            dispatch({ type: 'GET-CHATS', content: parsed.matchingChats })
        }
    }

      function fetchConstantly () {
        gatherUsers()
    }

    useEffect(()=> {
        gatherUsers()
        let timer = setInterval(fetchConstantly, 5000)
        return function cleanup() {
            clearInterval(timer)
        }
    }, [])

    const renderFeedPage = routerData => {
        return <Feed user={props.user}></Feed>
    }

    const renderEditProfile = routerData => {
        return <EditProfile user={props.user} history={routerData.history}></EditProfile>
    }

    const renderChangePassword = routerData => {
        return <ChangePassword user={props.user}></ChangePassword>
    }

    const renderChat = routerData => {
        return <ChatHistory user={props.user} allUsers={allUsers} chatLog={chatLog}></ChatHistory>
    }

    const renderEditPost = routerData => {
        return <EditPost user={props.user} postId={routerData.match.params.postId} history={routerData.history}/>
    }

    return (
        <div>
            <div style={{margin: '2em 0'}}></div>
            <Navigation user={props.user}/>
            <Route
                exact={true}
                path="/"
                render={renderFeedPage}
             />
            <Route
                exact={true}
                path="/account/edit"
                render={renderEditProfile}
             />
            <Route
                exact={true}
                path="/account/password"
                render={renderChangePassword}
             />
            <Route
                exact={true}
                path="/chat"
                render={renderChat}
             />
            <Route 
             exact={true}
             path='/edit/post/:postId'
             render={renderEditPost}
            />
        </div>        
    )
}

export default MainPage