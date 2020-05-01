import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components'
import OnePost from '../../components/posts/OnePost.jsx'

const FeedCard = styled.div`
display:flex;
flex-direction:column;
align-items:center;
margin-bottom:3em;
`

function Feed(props) {
    const feed = useSelector(state => state.feed)
    const dispatch = useDispatch()

    useEffect(()=> {
        console.log(feed)
        getFeed();
    }, []) //empty array as 2nd arg to prevent infinite looping

    const getFeed = async () => {
        let data = new FormData()
        data.append('following', props.user.social.following)
        let response = await fetch('/feed', {method: "POST", body: data})
        let body = await response.text()
        let parsed = JSON.parse(body)
        if (parsed.success) {
            dispatch({type: "SET-FEED", content: parsed.feed})
        }
    }
    return (
        <FeedCard>
            {props.user && feed[0] ? feed.map(item => {
                return (<OnePost item={item} key={item._id} feed={true}/>
                )}
            ) : <div style={{textAlign:'center'}}>Nothing to display! <br/> Go follow someone!</div>}
            
        </FeedCard>
    )
}

export default Feed
