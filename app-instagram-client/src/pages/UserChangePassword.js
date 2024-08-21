import Sidebar from "./Sidebar";
import '../style/UserSettings.css'
import {useEffect, useState} from "react";
import axios from "axios";
import ImageDisplay from "./ImageDisplay";
import profileImg from "../images/profileDemo.png";
import jwt_decode from "jwt-decode";

function UserChangePassword() {
    const [user, setUser] = useState('')
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassowrd] = useState('');
    const [cNewPassword, setCNewPassword] = useState('');
    const token = localStorage.getItem('jwtToken')
    const decodedToken = jwt_decode(token)
    const username = decodedToken.sub
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    useEffect(() => {
        getUser()
    }, [])

    function getUser() {
        axios.get('http://localhost/api/v2/user/' + username, config)
            .then(response => {
                setUser(response.data.object)
            }).catch(response => {
            if (response.response.status === 403) {
                window.location.replace('http://localhost:3000/login')
            }
        })
    }

    function redirectToEdit() {
        window.location.replace('http://localhost:3000/accounts/edit')
    }

    function changePassword() {
        let data={"oldPassword":oldPassword,"newPassword":newPassword,"confirmNewPassword":cNewPassword}
        console.log(data)
        if (oldPassword.length >= 7 && newPassword.length >= 7 && cNewPassword.length >= 7) {
            if (newPassword === cNewPassword) {
                axios.put('http://localhost/accounts/password/change',data, config)
                    .then(response=> {
                        window.location.reload()
                    })
            }
        }
    }

    return (<>
        <Sidebar/>
        <div className="main">
            <ul className="unor">
                <li>
                    <a onClick={redirectToEdit} className="unor_a">
                        <div>
                            <div className="choose_btn">
                                <span>Edit profile</span>
                            </div>
                        </div>
                    </a>
                </li>
                <li>
                    <a className="unor_a">
                        <div>
                            <div className="choose_btn">
                                <span>Change password</span>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
            <article className="article">
                <div className="article_div">
                    <div className="_ab3p">
                        <aside className="_ad6_">
                            {
                                user.attachmentId==null?<img alt='' src={profileImg}/>:
                                    <ImageDisplay isPost={false} id={user.attachmentId}/>
                            }
                        </aside>
                        <div className="_ab3t">
                            <div className="x9f619">
                                <div className="_adaw2_">
                                    {user.username}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="_ab3p">
                        <aside className="_ad6_">
                            <label className="_ab3q" htmlFor="oldPassword">Old password</label>
                        </aside>
                        <div className="_ab3t">
                            <div className="x9f619">
                                <input onChange={e=>{setOldPassword(e.target.value)}} aria-required="true" id="oldPassword" type="password"
                                       className="_ab3_"/>
                            </div>
                        </div>
                    </div>
                    <div className="_ab3p">
                        <aside className="_ad6_">
                            <label className="_ab3q" htmlFor="newPassword">New password</label></aside>
                        <div className="_ab3t">
                            <div className="x9f619">
                                <input onChange={e=>{setNewPassowrd(e.target.value)}} aria-required="true" id="newPassword" type="password"
                                       className="_ab3_"/>
                            </div>
                        </div>
                    </div>
                    <div className="_ab3p">
                        <aside className="_ad6_">
                            <label className="_ab3q" htmlFor="confirmNewPassword">Confirm new password</label></aside>
                        <div className="_ab3t">
                            <div className="x9f619">
                                <input onChange={e=>{setCNewPassword(e.target.value)}} aria-required="true" id="confirmNewPassword"
                                       type="password"
                                       className="_ab3_"/>
                            </div>
                        </div>
                    </div>
                    <div className="_ab3p">
                        <aside className="_ad6_">
                        </aside>
                        <div className="_ab3t">
                            <div className="_ab47">
                                <button onClick={changePassword} className="btn btn-primary">Change password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </>)
}

export default UserChangePassword;