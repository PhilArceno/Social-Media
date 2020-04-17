import React, {useEffect, useState} from 'react'
import { Route, BrowserRouter, Link, Switch, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import Register from './Register.jsx'
import Login from './Login.jsx'
import MainPage from './MainPage.jsx'
import ProfilePage from './ProfilePage.jsx'
import PostModal from './PostModal.jsx'
import Explore from './Explore.jsx'
import CreatePost from './CreatePost.jsx'
import CommentsPage from './components/CommentsPage.jsx'

function App(props) {
    const user = useSelector(state => state.user)
    const [prevLocation, setPrevLocation] = useState(props.location)
    const dispatch = useDispatch()

    const checkUser = async () => {
        let response = await fetch('/user', { method: 'GET' });
        let text = await response.text();
        let parsed = JSON.parse(text);
        dispatch({ type: 'SET-USER', content: parsed.user });
      };

    useEffect(() => {
            checkUser();

            let { location } = props
            if (!(location.state && location.state.modal)) { //replace previous location with current if there is no open modal
                setPrevLocation(location)
            }
            
    }, [props, prevLocation])


    const renderLoginPage = routerData => {
        return <Login history={routerData.history} />;
    }
    const renderSignupPage = routerData => {
        return <Register history={routerData.history} />;
    }
    const renderProfilePage = routerData => {
        return <ProfilePage user={user} userProfile={routerData.match.params.userProfile} isModal history={routerData.history}></ProfilePage>
    }
    const renderExplorePage = routerData => {
            return <Explore user={user}></Explore>
    }
    const renderCreatePost = routerData => {
            return <CreatePost user={user}></CreatePost>
    }
    const renderPostPage = routerData => {
        return <PostModal user={user} postId={routerData.match.params.postId} history={routerData.history}></PostModal>
    }
    const renderModal = routerData => {
        return <PostModal user={user} postId={routerData.match.params.postId} history={routerData.history} isModal></PostModal>
    }

    const renderCommentsPage = routerData => {
        return <CommentsPage user={user} postId={routerData.match.params.postId}/>
    }

    const { location } = props;
    const isModal = (
      location.state &&
      location.state.modal &&
      prevLocation !== location
    )

        return (
                <div>
                    {user ? <MainPage user={user} /> : (
                    <div>
                        <Route
                            exact={true}
                            path="/"
                            render={renderLoginPage}
                        />
                        <Route
                            exact={true}
                            path="/signup"
                            render={renderSignupPage}
                        />
                        </div>)
                    }
        <Switch location={isModal ? prevLocation : location}> //1. if modal is opened, store location object, and pass it to switch (instead of using current location)
            <Route
                exact={true}
                path="/profile/:userProfile"
                render={renderProfilePage}
            />
            <Route
                exact={true}
                path="/post/:postId"
                render={renderPostPage}
            />
            <Route
                exact={true}
                path="/explore"
                render={renderExplorePage}
            />
            <Route
                exact={true}
                path="/post/:postId/comments"
                render={renderCommentsPage}
            />
            {user ? <div>
            <Route
                exact={true}
                path="/create-post"
                render={renderCreatePost}
                /></div>
            :''}
            <Route>{''}</Route>
        </Switch>
        {isModal
        ? <Route exact path="/post/:postId" render={renderModal}>
        </Route>
        : null
      }
                </div>
        )
}

export default withRouter(App)