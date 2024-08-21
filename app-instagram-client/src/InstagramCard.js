import React, {useEffect, useState} from 'react'
import "./style/instaCard.scss";
import HomePost from "./component/HomePost";
import HomeUsers from "./component/HomeUsers";
import axios from "axios";
import Sidebar from "./pages/Sidebar";



const InstagramCard = () => {
    const [postList, setPostList] = useState([]);
    const token = localStorage.getItem('jwtToken')
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    useEffect(() => {
        getPost();
    }, []);

    function getPost() {
        axios.get("http://localhost/api/post/getAll",config)
            .then(res => {
                setPostList(res.data.object)
            });
    }



    return (
        <div className="insta-card-main">
            <Sidebar/>

                    <HomeUsers/>
            {
                postList.map((post)=>(
                    <HomePost postId={post.id} attachmentId={post.attachmentId} user={post.user} caption={post.caption}/>
                ))
            }
        </div>
    )
}

export default InstagramCard;