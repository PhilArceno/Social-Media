import React from 'react'
import { Link } from 'react-router-dom'


function ProfileFeed(props) {

    return (
        <div className="grid-container">
        {props.uploads ? 
        props.uploads.map((post, index) => {
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
        })
        : ''}
    </div>
    )
}

export default ProfileFeed