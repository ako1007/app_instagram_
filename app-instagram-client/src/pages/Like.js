import {useEffect, useState} from "react";
import axios from "axios";
import "../style/Like.css"

import "../pages/LikeNotification"

function Like({postId}) {
    const [likeCount, setLikeCount] = useState(0);
    const token = localStorage.getItem('jwtToken')
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    const [isLiked,setIsLiked]=useState(false)

    const openLike = () => setIsLiked(!isLiked);
    useEffect(()=>{
        axios.get(`http://localhost/api/like/check/${postId}`,config).then((res)=>{
            setIsLiked(res.data.object.likedByCurrenUser)
            setLikeCount(res.data.object.likeCount)
            console.log(isLiked)
        })
    },[postId])


    const handleLikeClick = () => {
        if (isLiked) {
            setLikeCount(likeCount - 1);
            axios.post(`http://localhost/api/like/likes/${postId}`,config, config)
                .then(() => {
                    deleteNotification()
                    setIsLiked(false);
                });
        } else {
            setLikeCount(likeCount + 1);
            axios.post(`http://localhost/api/like/likes/${postId}`,config, config)
                .then(() => {
                    saveNotification()
                    setIsLiked(true);
                })
        }

        const saveNotification = () => {
            axios.post(`http://localhost/api/notifications/save/${postId}`,config, config)
        }
        const deleteNotification = () => {
            axios.delete(`http://localhost/api/notifications/delete/${postId}`,config,  config)
        }
    };
    return (<>
        <div className="likeCss">
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
            <span>{likeCount}</span>
        </div>
    </>);

}


export default Like;

