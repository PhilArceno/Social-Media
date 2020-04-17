import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ProfileFeed from './ProfileFeed.jsx'

const ProfileCard = styled.div`
display:flex;
flex-direction:column;
align-items:center;
margin-bottom:5em;
`

const Container = styled.div`
width:100%;
margin:auto;
@media screen and (min-width: 768px) {
max-width: 955px;
}
`

const PicContainer = styled.div`
    width: 220px;
    height: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow: 5px 5px 10px #cccccc, -5px -5px 10px #f7f7f7;
`

const DisplayPic = styled.div`
    background-image:url('${props=> props.pic ? props.pic : "/uploads/no-image-found.png"}');
    background-size:cover;
    width: 205px;
    height: 205px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow: inset 3px 3px 5px #818181, inset -3px -3px 5px #818181;
`

const InfoContainer = styled.div`
display:flex;
justify-content: space-between; 
width: 250px;
border-radius: 5px;
background: #f8f8f8;
box-shadow:  5px 5px 10px #e2e2e2, 
             -5px -5px 10px #f7f7f7;
padding: 1em;
margin-bottom:1em;
`

const Button = styled.button`
cursor:pointer;
border-radius: 5px;
border: none;
padding:1em;
background-color: #8d02ff;
color:white;
box-shadow:  5px 5px 10px #e2e2e2, 
             -5px -5px 10px #f7f7f7;
font-size:14px;

`

const EditProfile = styled(Link)`
border-radius: 5px;
border: none;
padding:1em;
background-color: #8d02ff;
color:white;
box-shadow:  5px 5px 10px #e2e2e2, 
             -5px -5px 10px #f7f7f7;
font-size:14px;
`
const Username = styled.div`
font-size:14px;
height:fit-content;
border-radius: 5px;
border: none;
padding:1em;
background: #f8f8f8;
box-shadow:  inset 5px 5px 10px #e2e2e2, 
             inset -5px -5px 10px #f7f7f7;
`

const Options = styled.div`
    font-size: 2em;
    width: fit-content;
    margin-left: auto;
    height:44px;

&:hover {
    cursor:pointer;
}
`

const OpenOptions = styled.div`
display:flex;
flex-direction:column;
position:relative;
top: .25em;
right:0;
`
const LogOut = styled(Button)`
background-color:red;
margin-top:.5em;
box-shadow:none;
`

function ProfilePage(props) {
    const [profile, setProfile] = useState({
        fullName: '',
        profilePicture: '', 
        profileDescription: '', 
        followers: [], 
        following: [], 
        likes: [], 
        uploads: []
    })
    const [options, setOptions] = useState({clicked: false})
    const [followButton, setFollowButton] = useState({x: false})

    const dispatch = useDispatch()


    const checkProfile = async () => {
        let data = new FormData()
        data.append('user', props.userProfile)
        let response = await fetch('/check-profile', { method: 'POST', body: data });
        let body = await response.text();
        let parsed = JSON.parse(body);
        if (parsed.success) {
            setProfile({
                ...profile,
                fullName: parsed.user.fullName,
                username: parsed.user.username, 
                profilePicture: parsed.user.profilePicture, 
                profileDescription: parsed.user.profileDescription, 
                followers: parsed.user.social.followers, 
                following: parsed.user.social.following,  
                likes: parsed.user.likes, 
                uploads: parsed.uploadedPosts.reverse()
            })
        }
    }

    useEffect(() => {
        checkProfile()
    }, [props.userProfile])

    const handleFollowUnfollow = async (action) => {
        let data = new FormData()
        data.append('profile', props.userProfile)
        if (action === 'follow') {
            data.append('action', action)
        }
        if (action === 'unfollow') {
            data.append('action', action)
        }
        let response = await fetch('/handle-follow', { method: 'POST', body: data });
        let text = await response.text();
        let parsed = JSON.parse(text);
        if (parsed.success) {
            setProfile({
                ...profile,
                followers: parsed.newProfile.value.social.followers, 
                following: parsed.newProfile.value.social.following
            })
            dispatch({type: "SET-USER", content:parsed.user.value})
        }
    }

    let handleFollowButton = () => {
        let button 
        if (props.userProfile !== props.user.username) {
            if (profile.followers.length > 0) {
                profile.followers.forEach((follower, index) => {
                    if (follower === props.user.username) {
                        button =  <Button key={index} onClick={(event) => {handleFollowUnfollow('unfollow')}}>Unfollow</Button>
                    }else {
                        button = <Button key={index} onClick={(event) => {handleFollowUnfollow('follow')}}>Follow</Button>
                    }
            })
        }
        if (profile.followers.length < 1) {
            button = <Button onClick={(event) => {handleFollowUnfollow('follow')}}>Follow</Button>
        }
    }
    return button
    }

    const handleOptions = () => {
        setOptions({clicked: !options.clicked})
    }

    const logoutHandler = () => {
        fetch('/logout', { method: 'POST' });
        dispatch({ type: 'LOGOUT' });
        props.history.push('/')
      };
    
    return (
        <ProfileCard>
                {profile ? 
                    <Container>
                        <div style={{display: 'flex', justifyContent: 'space-between', margin: '0 1em 0 1em'}}>
                            <Username>{profile.username ? '@' + profile.username : ''}</Username>
                        {props.user ? (
                            profile.username === props.user.username ? (<div style={{height:'44px'}}>
                            <Options onClick={handleOptions}>
                                &#8942;
                            </Options>
                                {options.clicked ?
                                    <OpenOptions>
                                        <EditProfile to="/account/edit">Edit Profile</EditProfile>
                                        <LogOut onClick={logoutHandler}> 
                                            Logout
                                        </LogOut>
                                    </OpenOptions>
                                : ''}
                            </div>
                                ) : ''
                            ): ''}
                            {props.user ? ( //user true?
                                handleFollowButton()
                            ) : ''}
                        </div>
                        <div style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
                            <PicContainer><DisplayPic pic={profile.profilePicture}/></PicContainer>
                            <h2>{profile.fullName}</h2>
                            <InfoContainer>
                                <div>{profile.following.length ? profile.following.length : 0} following</div>
                                    <div>{profile.followers.length} 
                                        {profile.followers.length > 1 || profile.followers.length === 0 ? ' followers' : ' follower' }
                                    </div>
                                <div>{profile.uploads ? profile.uploads.length : '0' } 
                                    {profile.uploads.length > 1 || profile.uploads.length === 0 ? ' posts' : ' post'}
                                </div>
                            </InfoContainer>
                            <div style={{margin: '0 0 1em 0'}}>{profile.profileDescription}</div>
                        </div>
                        <ProfileFeed uploads={profile.uploads}/>
                    </Container>
                : ''}
        </ProfileCard>
    )
}

export default ProfilePage