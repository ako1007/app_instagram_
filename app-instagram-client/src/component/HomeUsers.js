import React, {useEffect, useState} from 'react';
import ImageDisplay from "../pages/ImageDisplay";
import axios from "axios";
import profileImg from "../images/profileDemo.png";


function HomeUsers({attachmentId,username}) {
    const [allUsers, setUsers] = useState([]);
    const token = localStorage.getItem('jwtToken')
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    useEffect(()=>{
        getAllUsers()
    },[])
    function getAllUsers() {
        axios.get('http://localhost/api/v2/user/all', config).then((res) => {
            console.log(res.data.object)
            setUsers(res.data.object)
        }).catch(() => {
            window.location.replace('http://localhost:3000/login')
        })
    }
    return (
        <div>
            <div className="usernames">
                <div className="users">
                    {
                        allUsers.map((user,index)=>(
                            <a key={index} href={`/${user.username}`} className="user__">
                                <div>{user.attachmentId == null ? <img alt='' src={profileImg}/> :
                                    <ImageDisplay isPost={false} id={user.attachmentId}/>}</div>
                                <p>{user.username}</p>
                            </a>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default HomeUsers;