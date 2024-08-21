import React, {useEffect, useState} from 'react';
import ImageDisplay from "../pages/ImageDisplay";
import axios from "axios";
import profileImg from '../images/profileDemo.png'

function HomePost({postId,caption, user, attachmentId}) {

    const token = localStorage.getItem('jwtToken');
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };

    const [userr, setUser] = useState('')

    function getUser() {
        axios.get('http://localhost/api/v2/user/' + user, config)
            .then(response => {
                setUser(response.data.object)
            })
    }

    useEffect(() => {
        getUser();
    }, [])

    //like start
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked,setIsLiked]=useState(false)

    const openLike = () => setIsLiked(!isLiked);
    useEffect(()=>{
        axios.get(`http://localhost/api/like/check/${postId}`,config,config).then((res)=>{
            setIsLiked(res.data.object.likedByCurrenUser)
            setLikeCount(res.data.object.likeCount)
        })
    },[postId])
     const handleLikeClick = () => {
        if (isLiked) {
            setLikeCount(likeCount - 1);
            axios.post(`http://localhost/api/like/likes/${postId}`, config, config)
                .then(() => {
                    deleteNotification()
                    setIsLiked(false);
                });
        } else {
            setLikeCount(likeCount + 1);
            axios.post(`http://localhost/api/like/likes/${postId}`, config, config)
                .then(() => {
                    saveNotification()
                    setIsLiked(true);
                })
        }

        const saveNotification = () => {
            axios.post(`http://localhost/api/notifications/save/${postId}`, config, config)
        }
        const deleteNotification = () => {
            axios.delete(`http://localhost/api/notifications/delete/${postId}`, config, config)
        }

    }

        //like end


    return (
        <div className="home_posts_main">
            <div className="home_one_post">
                <div className="home_post_menu">
                    <a href={`/${userr.username}`} className="user__ home_post_img">
                        <div>{userr.attachmentId == null ? <img alt='' src={profileImg}/> :
                            <ImageDisplay isPost={false} id={userr.attachmentId}/>}</div>
                    </a>
                    <div className="home_post_username">
                        <a href={`/${userr.username}`} className="home_post_username1">{userr.username}</a>
                        <a href="#" className="home_post_username1">original audio</a>
                    </div>
                    <div className="home_post_menu_1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" fill="white"
                             className="bi bi-three-dots" viewBox="0 0 16 16">
                            <path
                                d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                        </svg>
                    </div>
                </div>
                <div className="home_post_attachment">
                    <div className="home_post_attachment_div">
                        <div className="home_post_content" id="home_post">
                            <ImageDisplay isPost={true} id={attachmentId}/>
                        </div>
                    </div>
                    <div className="home_post_content_info">
                        <div className="home_post_content_1">
                            {isLiked ? <svg xmlns="http://www.w3.org/2000/svg" width="30" fill="red"
                                            className="likeButton" viewBox="0 0 16 16" onClick={() => {
                                openLike();
                                handleLikeClick();
                            }}>
                                <path fillRule="evenodd"
                                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                          className="likeButton" onClick={() => {
                                openLike();
                                handleLikeClick();
                            }} viewBox="0 0 16 16" width="30">
                                <path
                                    d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                            </svg>}
                            <svg aria-label="Comment" color="rgb(245, 245, 245)"
                                 fill="rgb(245, 245, 245)" role="img" viewBox="0 0 24 24">
                                <title>Comment</title>
                                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none"
                                      stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                            </svg>
                            <svg aria-label="Share Post" color="rgb(245, 245, 245)"
                                 fill="rgb(245, 245, 245)" role="img" viewBox="0 0 24 24">
                                <title>Share Post</title>
                                <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
                                      x1="22" x2="9.218" y1="3" y2="10.083"></line>
                                <polygon fill="none"
                                         points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                                         stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                            </svg>
                            <svg aria-label="Save" className="home_post_save" color="rgb(245, 245, 245)"
                                 fill="rgb(245, 245, 245)" role="img" viewBox="0 0 24 24">
                                <title>Save</title>
                                <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                                         stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                         strokeWidth="2"></polygon>
                            </svg>
                        </div>
                        <div className="home_post_content_2">
                            <a href="#"><span>{likeCount}</span> {likeCount>1?'likes':'like'}</a>
                            <a href={`/${userr.username}`} className="home_post_username1">{userr.username}</a>
                            <p> {caption.length > 50 ? caption.substring(0, 50) : caption} ...</p>
                            <a href="#" className="more">more</a>
                            <p className="view_comment">View all 15 comments</p>
                            <p className="ago"><span>1 DAY AGO </span>See translation</p>

                        </div>
                        <div className="input_comment">
                            <svg aria-label="Emoji" color="rgb(245, 245, 245)"
                                 fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24"
                                 width="28"><title>Emoji</title>
                                <path
                                    d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                            </svg>
                            <textarea placeholder="Add a comment..."/>
                            <div className="send_comment_post">Post</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePost;