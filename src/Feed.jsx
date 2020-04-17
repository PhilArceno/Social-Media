import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components'
import OnePost from './OnePost.jsx'

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

{/* <svg aria-label="Unlike" fill="#ed4956" height="24" viewBox="0 0 48 48" width="24">
<path clip-rule="evenodd" d="M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z" 
fill-rule="evenodd"></path>
</svg> */}