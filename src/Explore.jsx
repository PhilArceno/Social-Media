import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Route, Link } from 'react-router-dom'
import styled from 'styled-components'


const ExploreCard = styled.div`
display:flex;
flex-direction:column;
align-items:center;
`

const FeedContainer = styled.div`
width:100%;
display: flex;
justify-content: space-between;
flex-wrap:wrap;

@media screen and (min-width: 768px) {
max-width: 650px;
}
`

const ImgContainer = styled.div`
width: 33%;
max-height:200px;
margin-bottom:3px;

@media screen and (min-width: 768px) {
    width:unset;
    margin-bottom:0.7em;
}
`

const Search = styled.input`
width:90%;
max-width:955px;

`

function Explore(props) {
    const [feed, setFeed] = useState({posts: []})
    const [search, setSearch] = useState({input:''})


    const handleGetFeed = async () => {
        let response = await fetch('/explore-feed', { method: 'GET'});
        let text = await response.text()
        let parsed = JSON.parse(text)
        if (parsed.success) {
            setFeed({...feed,
                posts: parsed.exploreFeed.reverse()
            })
        }
    }

    useEffect(()=> {
        handleGetFeed()
    }, [])

    const handleSearch = e => {
        setSearch({input: e.target.value.toLowerCase()})
    }

    return (
        <div style={{margin: '0 0 3.75em'}}>
            <h6 style={{textAlign:'center'}}>Explore</h6>  
            <div style={{display:'flex', justifyContent:'center', marginBottom:'2em'}}>
            <Search type="text" className="textInput" onChange={handleSearch} placeholder='Search for a tag...' value={search.input}></Search>
        </div>
        <div className="grid-container">
        {feed.posts ? 
        feed.posts.map((post, index) => {
            if (!search.input) {
            return <div key={index}>
            <Link className="post-preview" to={{
                pathname: '/post/' + post._id,
                state: {modal:true}
            }}>
                    <div style={{display:'flex'}}>{post.likes.length} &nbsp;
                        <svg aria-label="Like" fill="#FFFFFF" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z" fillRule="evenodd"></path></svg>
                    </div>
                <img className='image-preview' src={post.img[0]}/>
            </Link>
            </div>
        }
        if (search.input) {
            for (let i = 0; i < post.tags.length; i++) {
                if (post.tags[i].slice(0, search.input.length) === search.input) {
                    return (<div>
                    <Link className="post-preview" to={{
                        pathname: '/post/' + post._id,
                        state: {modal:true}
                    }}>
                            <div style={{display:'flex'}}>{post.likes.length} &nbsp;
                                <svg aria-label="Like" fill="#FFFFFF" height="24" viewBox="0 0 48 48" width="24"><path clipRule="evenodd" d="M35.3 35.6c-9.2 8.2-9.8 8.9-11.3 8.9s-2.1-.7-11.3-8.9C6.5 30.1.5 25.6.5 17.8.5 9.9 6.4 3.5 13.7 3.5 20.8 3.5 24 8.8 24 8.8s3.2-5.3 10.3-5.3c7.3 0 13.2 6.4 13.2 14.3 0 7.8-6.1 12.3-12.2 17.8z" fillRule="evenodd"></path></svg>
                            </div>
                        <img className='image-preview' src={post.img[0]}/>
                    </Link>
                    </div>)
                }
            }

        }
    })
        : ''}
    </div>
    </div>
    )
}

export default Explore