import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import OnePost from './OnePost.jsx'

const ModalWrapper = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    -webkit-overflow-scrolling: touch;
    padding: 1em 0 1em 0;
    width: 100%;
    background-color: white;
    height: 100vh;
    z-index:2;


@media screen and (min-width: 990px) {
    width: 100vw;
    height: ${props => props.user ? '90vh' : '100vh'};
    /* backdrop-filter: blur(1px); */
    background-color: rgba(0,0,0,0.2);
    display:flex;
    justify-content: center;
    align-items:center;
}
`

const Modal = styled.div `

`

const Exit = styled.div`
    position: fixed;
    top: .2em;
    right: .5em;
    font-size:1.5em;
    cursor:pointer;
    z-index:4;
    color:#B2B2B2;
`

const ImgContainer = styled.div`

@media screen and (min-width: 990px) {
    width:65%;
height:100%;
}

> img {
    border-radius:10px;
    width:100%;

    @media screen and (min-width: 990px) {
    height:100%;
    object-fit:cover;
    }
}
`

function PostModal(props) {
    let opened
    const [post, setPost] = useState({onePost: undefined})
    const getPost = async () => {
        let data = new FormData()
        data.append('postId', props.postId)
        let response = await fetch('/get/post', {method: 'POST', body: data})
        let text = await response.text()
        let parsed = JSON.parse(text)
        if (parsed.success) {
            setPost({onePost: parsed.post})
        }
    }
    
    useEffect(() => {
        getPost()

        if (props.isModal) {
             opened = true
             if (opened) {
                document.getElementById("body").style.overflow = 'hidden'
            }
        }

        return function cleanup() {
            opened = false
            if (!opened) {
                document.getElementById("body").style.overflow = 'auto'
            } 
        }
    }, [])


    
        return (
            <div>
            { props.isModal ? <Exit onClick={ props.isModal ? () => props.history.goBack() : null}>&#10006;</Exit> : ''}
            <ModalWrapper user={props.user} role="button" //wrapper
                onClick={ props.isModal ? () => props.history.goBack() : null} style={ !props.isModal ? {backgroundColor:'white'} : {}}>  
                <Modal onClick={e => e.stopPropagation()}>              
                    {post.onePost ?
                    <OnePost item={post.onePost} isModal={props.isModal} isLink={!props.isModal ? true : false} history={props.history} onClick={e => e.stopPropagation()}></OnePost>
                    : ''}
                </Modal>
                </ModalWrapper>
            </div>
        )
}

export default withRouter(PostModal)