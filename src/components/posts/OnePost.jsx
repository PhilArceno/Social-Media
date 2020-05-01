import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const PostContainer = styled.div`
width:95%;
margin:0 auto;
margin-bottom:${props => props.feed ? '3em' : '0'};


@media only screen and (min-width: 990px) {
    background:#fbfbfb;
    max-width: 600px;
    padding: .5em 1em 1em;
    border-radius: 10px;
    box-shadow: ${props => props.modal ? '' : '20px 20px 60px #d5d5d5, -20px -20px 60px #f7f7f7'};
    max-height: ${props => !props.feed ? '655px' : 'none'};
    overflow: ${props => !props.feed ? 'auto' : 'none'};
}
`

const PFPContainer = styled.div`
width:40px;
height:40px;
border-radius: 50%;
background: #fbfbfb;
box-shadow:  3px 3px 4px #c9c9c9, 
             -3px -3px 4px #f7f7f7;
margin-right: .7em;
display:flex;
align-items:center;
justify-content:center;
`

const PFP = styled.img`
height:30px;
width:30px;
border-radius:50%;
`

const PostUser = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
padding:0.5em;
`

const PostDesc = styled.div`
padding: 0.5em 0;
`

const PostNav = styled.div`
display:flex;
`

const PostNavItem = styled.div`
    display: flex;
    align-items: center;
`

const ImgSlider = styled.div`
    border-radius: 10px;
    max-height:400px;
    height:100%;
    display:flex;
    overflow-x:hidden;
    scroll-snap-type: x mandatory;
    max-width:590px;
    margin:auto;
    -webkit-overflow-scrolling: touch;
    @media only screen and (min-width: 990px) {
        max-width:600px;
        max-height:600px;
    }
`

const PostImg = styled.img`
    width:100%;
    flex-shrink:0;
    scroll-snap-align: start;
    scroll-behavior: smooth;
    object-fit: cover;
/* position:relative; */
`

const InputComment = styled.input`
width: 92%;
`

const Edit = styled.div`
color: lightgrey;
font-size: 1.2em;
transform: scaleX(-1);

&:hover {
    color:#8d02ff;
    cursor:pointer;
}
`

export default function OnePost(props) {
    let user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [like, setLike] = useState({clicked:false, unClickedHeart: "M34.3 3.5C27.2 3.5 24 8.8 24 8.8s-3.2-5.3-10.3-5.3C6.4 3.5.5 9.9.5 17.8s6.1 12.4 12.2 17.8c9.2 8.2 9.8 8.9 11.3 8.9s2.1-.7 11.3-8.9c6.2-5.5 12.2-10 12.2-17.8 0-7.9-5.9-14.3-13.2-14.3zm-1 29.8c-5.4 4.8-8.3 7.5-9.3 8.1-1-.7-4.6-3.9-9.3-8.1-5.5-4.9-11.2-9-11.2-15.6 0-6.2 4.6-11.3 10.2-11.3 4.1 0 6.3 2 7.9 4.2 3.6 5.1 1.2 5.1 4.8 0 1.6-2.2 3.8-4.2 7.9-4.2 5.6 0 10.2 5.1 10.2 11.3 0 6.7-5.7 10.8-11.2 15.6z"})
    const [newComment, setComment] = useState({comment: ''})


    const handleLikeToggle = async () => {
        if (!like.clicked) {
            setLike({...like, 
                clicked: true,
                unClickedHeart: "M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"            
            })
            if (props.isModal || props.isLink) {
                props.item.likes.push(user.username)
            }
        }
        if (like.clicked) {
            setLike({...like, 
                unClickedHeart: "M34.3 3.5C27.2 3.5 24 8.8 24 8.8s-3.2-5.3-10.3-5.3C6.4 3.5.5 9.9.5 17.8s6.1 12.4 12.2 17.8c9.2 8.2 9.8 8.9 11.3 8.9s2.1-.7 11.3-8.9c6.2-5.5 12.2-10 12.2-17.8 0-7.9-5.9-14.3-13.2-14.3zm-1 29.8c-5.4 4.8-8.3 7.5-9.3 8.1-1-.7-4.6-3.9-9.3-8.1-5.5-4.9-11.2-9-11.2-15.6 0-6.2 4.6-11.3 10.2-11.3 4.1 0 6.3 2 7.9 4.2 3.6 5.1 1.2 5.1 4.8 0 1.6-2.2 3.8-4.2 7.9-4.2 5.6 0 10.2 5.1 10.2 11.3 0 6.7-5.7 10.8-11.2 15.6z",
                clicked: false})
                if (props.isModal || props.isLink) {
                    let filtered = props.item.likes.filter(name => name !== user.username)
                    props.item.likes = filtered
                }
        }

        let data = new FormData()
        data.append("post", props.item._id)
        data.append("following", user.social.following)
        let response = await fetch('/post/like', {method: 'POST', body: data})
        let body = await response.text()
        let parsed = JSON.parse(body)
        dispatch({type: "SET-FEED", content: parsed.feed})
        dispatch({ type: 'SET-USER', content: parsed.user });

    }

    const handleComment = async event => {
        event.preventDefault()
        
        if (!newComment.comment || newComment.comment === ' ') return
        
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        let data = new FormData()
        data.append("comment", newComment.comment)
        data.append('time', dateTime)
        data.append("post", props.item._id) 
        let response = await fetch('/post/comment/new', {method: 'POST', body: data})
        let body = await response.text()
        let parsed = JSON.parse(body)
        if (parsed.success) {
            dispatch({type: "SET-FEED", content: parsed.feed})
            setComment({comment:''})
            if (props.isModal || props.isLink) {
                location.reload()
            }
        }
    }

    const handleDeleteComment = async comment => {
        let data = new FormData()
        data.append("username", comment.username)
        data.append("comment", comment.comment)
        data.append("post", props.item._id) 
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

    useEffect(()=> {
        // document.getElementById(props.item._id).addEventListener("dblclick", handleLikeToggle)

        if (user && user.likes) {
            user.likes.forEach(likedPost => {
                if (likedPost === props.item._id) {
                    setLike({...like, 
                           clicked:true,
                           unClickedHeart: "M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"
                            })
                }
            })
        }

    }, [user])
    return (
        <PostContainer modal={props.isModal} feed={props.feed}>
                    <PostUser><Link to={'/profile/' + props.item.uploader}>
                        <div style={{display:'flex', alignItems: 'center'}}>
                            <PFPContainer>
                                <PFP className="circle" src={props.item.profilePicture}></PFP>
                            </PFPContainer>
                            <div style={{display:'flex', flexDirection:'column'}}>
                                <div>{props.item.uploader}</div>
                                {props.item.location ? <div style={{fontSize: '12px', color:'black'}}>{props.item.location}</div> : ''}
                            </div>
                        </div>
                        </Link>
                        {user && props.item.uploader === user.username ? 
                            <Edit>
                                <Link to={'/edit/post/' + props.item._id}>&#9998;</Link>
                            </Edit> 
                        : ''}
                        </PostUser>
                    <ImgSlider>
                        {props.item.img.map((img, index) => {
                            return <PostImg key={index} src={'..' + img}></PostImg>
                        })}
                    </ImgSlider>
                    <div style={{padding: "0.75em 0.5em 0 0.5em"}}>
                    <PostNav>
                        <PostNavItem>
                            {user ?
                                <button style={{display:"contents"}} onClick={handleLikeToggle}>
                                    <svg aria-label="Like" fill="#FF6767" height="24" viewBox="0 0 48 48" width="24">
                                        <path clipRule="evenodd" d={like.unClickedHeart}
                                        fillRule="evenodd"></path>
                                    </svg>
                                </button>
                             :<svg aria-label="Like" fill="#FF6767" height="24" viewBox="0 0 48 48" width="24">
                             <path clipRule="evenodd" d="M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z"
                             fillRule="evenodd"></path>
                         </svg>}
                                &nbsp;
                                {/* {props.item.likes.length === 1 ? props.item.likes.length + ' Like' : ''} */}
                                {props.item.likes.length !== 0 ? props.item.likes.length  : ''}
                        </PostNavItem>
                        <PostNavItem>
                        <button style={{display:"contents"}}>
                            <svg style={{marginLeft: '.5em'}}aria-label="Comment" fill="#BBBBBB" height="24" viewBox="0 0 48 48" width="24">
                                <path clipRule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 
                                11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 
                                10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 
                                3.5 24 3.5 44.5 12.7 44.5 24z" fillRule="evenodd">
                                </path>
                            </svg>
                        </button>
                            &nbsp;
                            {props.item.comments.length > 0 ? props.item.comments.length  : ''}
                        </PostNavItem>
                    </PostNav>
                    <PostDesc><Link to={'/profile/' + props.item.uploader}>{props.item.uploader}</Link>{' ' + props.item.description}</PostDesc>
                    {props.item.comments ? (
                        <div>{props.item.comments.map((comment, index) => {
                            if (user && comment.username === user.username) { //map users comments
                                return(<div key={index} style={{display:"flex", justifyContent: "space-between", lineHeight: "1.5em"}}> 
                                <div style={{color: 'grey'}}><Link to={'/profile/' + comment.username}>{comment.username}</Link> {' ' + comment.comment}</div> 
                                {user && user.username === comment.username || user && user.username === props.item.uploader  ? <button style={{backgroundColor: "transparent", border: "none",cursor: 'pointer'}} onClick={() => handleDeleteComment(comment)}>x</button> : '' }
                                </div>)
                            }
                            if (!user || index < 2 && comment.username !== user.username) {  //map comments that are not users
                            return (<div key={index} style={{display:"flex", justifyContent: "space-between", lineHeight: "1.5em"}}> 
                            <div style={{color: 'grey'}}><Link to={'/profile/' + comment.username}>{comment.username}</Link> {' ' + comment.comment}</div> 
                            {user && user.username === comment.username || user && user.username === props.item.uploader  ? <button style={{backgroundColor: "transparent", border: "none",cursor: 'pointer'}} onClick={() => handleDeleteComment(comment)}>x</button> : '' }
                            </div>)}
                        })}</div>
                    ) : ''}
                    {props.item.comments.length > 2 ? 
                    <Link to={'/post/' + props.item._id + '/comments'}>View all comments</Link>
                    : ''}
                    {user ? 
                    <form style={{display:'flex', alignContent: 'center', justifyContent: 'space-between', marginTop: '.5em'}} onSubmit={handleComment}>
                        <PFPContainer><PFP src={user.profilePicture}></PFP></PFPContainer>
                        <InputComment className="textInput" type="text" value={newComment.comment} placeholder="Add a comment"
                        onChange={(event) => setComment({...newComment, comment: event.target.value })}/>
                        <input style={{display:'none'}} type="submit"></input>
                    </form>
                    : ''}
                </div>
        </PostContainer>
    )
} 