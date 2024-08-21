import '../style/profilePage.css'
import {Modal, Row} from "reactstrap"
import Sidebar from "./Sidebar";
import jwt_decode from 'jwt-decode';
import {useEffect, useState} from "react";
import axios from "axios";
import ImageDisplay from './ImageDisplay';
import profileImg from '../images/profileDemo.png'
import {useParams} from 'react-router-dom';
import PostPopup from "./PostPopup";

function OtherProfile() {
    const [selectedPostId, setSelectedPostId] = useState(``);
    const [modal, setModal] = useState(false)
    const [modalFollowing, setModalFollowing] = useState(false)
    const [follower, setFollower] = useState([])
    const [following, setFollowing] = useState([])
    const [user, setUser] = useState('')
    const [posts, setPosts] = useState([])
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const username = decodedToken.sub
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    useEffect(() => {
        getUser();
        getFollowers();
        getFollowings();
        getPost();
    }, [])
    const {userr} = useParams();
    const openModal = () => {
        setModal(!modal)
    }
    const openModalFollowing = () => {
        setModalFollowing(!modalFollowing)
    }

    //todo check jwt expiration
    function getFollowers() {
        axios.get("http://localhost/api/v2/user/" + userr + "/followers", config)
            .then(response => {
                setFollower(response.data)
            })
    }

    function getFollowings() {
        axios.get("http://localhost/api/v2/user/" + userr + "/following", config)
            .then(response => {
                setFollowing(response.data)
            })
    }

    function getUser() {
        axios.get('http://localhost/api/v2/user/' + userr, config)
            .then(response => {
                setUser(response.data.object)
            }).catch(response => {
            if (response.response.status === 403) {
                window.location.replace('http://localhost:3000/login')
            }
        })
    }

    function follow() {
        axios.get('http://localhost/api/v2/user/' + userr + '/follow', config)
            .then(() => {
                window.location.reload();
            })
    }

    function unfollow() {
        axios.delete('http://localhost/api/v2/user/' + userr + '/unfollow', config)
            .then(() => {
                window.location.reload();
            })
    }

    function isFollowed() {
        if (user.username !== username) {
            return <button onClick={() => {
                unfollow()
            }} className="btn btn-primary btn_remove">Unfollow
            </button>;
        } else {
            return <button onClick={() => {
                follow()
            }} className="btn btn-primary btn_remove">Follow
            </button>;
        }
    }
    function getPost() {
        axios.get(`http://localhost/api/post/get/${userr}`, config).then((res) => {
            setPosts(res.data)
        })
    }

    const handlePostClick = (postId) => {
        setSelectedPostId(postId.id);
        setIsPopupOpen(true);
    };
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <Sidebar/>
            <Row className="m-0">
                <div className="col-3"></div>
                <div className="main_p col-9">
                    <div className="user-t">
                        <Row className="m-0">
                            <div className="profile_img">
                                {
                                    user.attachmentId == null ? <img alt='' src={profileImg}/> :
                                        <ImageDisplay isPost={false} id={user.attachmentId}/>
                                }
                            </div>
                            <div className="col-7">
                                <div className="profile_username">
                                    <h2>{user.username}</h2>
                                    {user.followedUser === true ? (<>
                                        <button onClick={() => {
                                            unfollow()
                                        }} className="profile_username_button">Unfollow
                                        </button>
                                    </>) : (<>
                                        <button onClick={() => {
                                            follow()
                                        }} className="profile_username_button">Follow
                                        </button>
                                    </>)}
                                    <button className="profile_username_button">Message</button>

                                </div>

                                <div className="profile_follow">
                                    <span>{user.postcount} posts</span>
                                    <span onClick={openModal} className="follower">{follower.length} followers</span>
                                    <span onClick={openModalFollowing}
                                          className="follower">{following.length} following</span>
                                </div>
                                <div className="profile_bottom">
                                    <span>{user.fullName}</span>
                                    <h1>{user.bio == null ? null : user.bio}</h1>
                                    <a target="_blank" href={user.website == null ? null : user.website}>
                                        {user.website == null ? null : user.website}</a>
                                </div>
                            </div>
                        </Row>
                    </div>
                </div>
            </Row>
            <Row className="m-0">
                <div className="col-3"></div>
                <div className="main_p1 col-8">
                    <div className="p1_p">
                        <div>
                            <svg aria-label="" className="_ab6-" color="rgb(245, 245, 245)" fill="rgb(245, 245, 245)"
                                 height="12" role="img" viewBox="0 0 24 24" width="12">
                                <rect fill="none" height="18" stroke="currentColor" stroke-linecap="round"
                                      stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"></rect>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                                <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                            </svg>
                            <span>POSTS</span>
                        </div>
                    </div>
                    <Row className="m-0 p1_posts no-padding">
                        {posts.map((item, i) => (
                            <div className="col-4 p1_post" key={i} onClick={()=>{
                                 handlePostClick(item);
                            }}>
                                <ImageDisplay isPost={false} id={item.attachmentId} />
                            </div>
                        ))}
                        {isPopupOpen && (
                            <PostPopup postId={selectedPostId} onClose={closePopup}/>
                        )}
                    </Row>
                </div>
            </Row>
            <Modal centered isOpen={modal} toggle={openModal}>
                <div className="follower_modal-head modal-header">
                    <h1>Followers</h1>
                    <button onClick={openModal} className="follower_btn">
                        <div className="follower_btn_div">
                            <svg aria-label="Close" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)"
                                 fill="rgb(245, 245, 245)" height="18" role="img" viewBox="0 0 24 24" width="18">
                                <title>Close</title>
                                <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor"
                                          strokeLinecap="round" stroke-linejoin="round" strokeWidth="3"></polyline>
                                <line fill="none" stroke="currentColor" strokeLinecap="round" stroke-linejoin="round"
                                      strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
                            </svg>
                        </div>
                    </button>
                </div>
                <div className="follower_modal modal-body">
                    {
                        follower.map(follower1 => (
                            <div key={follower1.id}>
                                <div className="follower_result">
                                    {
                                        follower1.attachmentId == null ? <img alt='' src={profileImg}/> :
                                            <ImageDisplay id={follower1.attachmentId}/>
                                    }
                                    <div className='follower_info'>
                                        <a href={`http://localhost:3000/${follower1.username}`}>{follower1.username}</a> <br/>
                                        <span>{follower1.fullName}</span>
                                    </div>
                                    <div className="follower_button">
                                        {isFollowed()}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Modal>
            <Modal centered isOpen={modalFollowing} toggle={openModalFollowing}>
                <div className="follower_modal-head modal-header">
                    <h1>Following</h1>
                    <button onClick={openModalFollowing} className="follower_btn">
                        <div className="follower_btn_div">
                            <svg aria-label="Close" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)"
                                 fill="rgb(245, 245, 245)" height="18" role="img" viewBox="0 0 24 24" width="18">
                                <title>Close</title>
                                <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor"
                                          strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
                            </svg>
                        </div>
                    </button>
                </div>
                <div className="follower_modal modal-body">
                    {
                        following.map(follower1 => (
                            <div key={follower1.id}>
                                <div className="follower_result">
                                    {
                                        follower1.attachmentId == null ? <img alt='' src={profileImg}/> :
                                            <ImageDisplay isPost={false} id={follower1.attachmentId}/>
                                    }
                                    <div className='follower_info'>
                                        <a href={`http://localhost:3000/${follower1.username}`}>{follower1.username}</a> <br/>
                                        <span>{follower1.fullName}</span>
                                    </div>
                                    <div className="follower_button">
                                        {isFollowed()}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Modal>
        </>
    )
}

export default OtherProfile;