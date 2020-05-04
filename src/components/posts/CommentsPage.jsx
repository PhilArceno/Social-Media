import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Route, Link } from 'react-router-dom'

function CommentsPage(props) {
    const [thisPost, setPost] = useState({post: []})


    const getPost = async () => {
        let data = new FormData()
        data.append('postId', props.postId)
        let response = await fetch('/get/post', {method: "POST", body: data})
        let body = await response.text()
        let parsed = JSON.parse(body)
        if (parsed.success) {
            console.log(parsed)
            setPost({post: parsed.post})
        }
    }

    useEffect(()=> {
        getPost()
    }, [])

    const handleDeleteComment = async comment => {
        let data = new FormData()
        data.append("username", comment.username)
        data.append("comment", comment.comment)
        data.append("postId", props.postId) 
        let response = await fetch('/post/comment/delete', {method: 'POST', body: data})
        let body = await response.text()
        let parsed = JSON.parse(body)
        if (parsed.success) {
            dispatch({type: "SET-FEED", content: parsed.feed})
            if (props.isModal || props.isLink) {
                location.reload()
            }
        }
    }

    return (
        <div className="container">
            {thisPost.post && thisPost.post.comments ? (
                <div style={{width:'95%'}}>{thisPost.post.comments.map((comment, index) => {
                    if (props.user && comment.username === props.user.username) { //map users comments
                        return(<div key={index} style={{display:"flex", justifyContent: "space-between", lineHeight: "1.5em"}}> 
                        <div style={{color: 'grey'}}><Link to={'/profile/' + comment.username}>{comment.username}</Link> {' ' + comment.comment}</div> 
                        {props.user && props.user.username === comment.username || props.user && props.user.username === thisPost.uploader  ? <button style={{backgroundColor: "transparent", border: "none",cursor: 'pointer'}} onClick={() => handleDeleteComment(comment)}>x</button> : '' }
                        </div>)
                    }
                    if (!props.user || index < 2 && comment.username !== props.user.username) {  //map comments that are not users
                    return (<div key={index} style={{display:"flex", justifyContent: "space-between", lineHeight: "1.5em"}}> 
                    <div style={{color: 'grey'}}><Link to={'/profile/' + comment.username}>{comment.username}</Link> {' ' + comment.comment}</div> 
                    {props.user && props.user.username === comment.username || props.user && props.user.username === thisPost.uploader  ? <button style={{backgroundColor: "transparent", border: "none",cursor: 'pointer'}} onClick={() => handleDeleteComment(comment)}>x</button> : '' }
                    </div>)}
                })}</div>
            ) : ''}
        </div>        
    )
}

export default CommentsPage