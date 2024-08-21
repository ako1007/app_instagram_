import React, {useEffect, useState} from 'react'
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from "axios";
import "../style/message.css";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Sidebar from "./Sidebar";
import jwt_decode from "jwt-decode";
import {Link} from "react-router-dom";
import profileImg from "../images/profileDemo.png";
import ImageDisplay from "./ImageDisplay";


let stompClient = null;
const Message = () => {
    const userUrl = () => document.getElementById("message").click();
    const [searchValue, setSearchValue] = useState('');


    const [allUsers, setUsers] = useState([]);
    const filteredUsers = allUsers.filter(user => user.username.includes(searchValue));
    const [username, setUsername] = useState(null);


    const handleInputChange = e => {
        setSearchValue(e.target.value);
    };

    const [search, setSearch] = useState(false);

    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const currentUsername = decodedToken.sub
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    useEffect((() => {
        setUsernameFromToken()
    }), [])

    function setUsernameFromToken() {
        try {
            let usernamee = jwt_decode(localStorage.getItem('jwtToken')).sub
            setUsername(usernamee)
        } catch (e) {
            window.location.replace('/login')
        }
    }


    const [deleteModal, setDeleteModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const openDeleteModal = () => setDeleteModal(!deleteModal);
    const openSearchModal = () => setSearchModal(!searchModal);

    let [connectedUsers, setConnectedUsers] = useState([]);
    const [data, setData] = useState({});

    const [messager, setMessager] = useState({});

    const [privateChats, setPrivateChats] = useState(new Map());
    // const [data, setData] = useState(new Map());

    const [privateChat, setPrivateChat] = useState(new Map());
    // const [allMessage, setAllMessage] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [getAll, setGetAll] = useState({});
    const [tab, setTab] = useState("CHATROOM");
    const [name, setName] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '', receivername: '', connected: false, message: ''
    });


    useEffect(() => {

        console.log(sessionStorage.getItem("username"))
        setUserData({...userData, 'username': sessionStorage.getItem("username")})
        axios1(sessionStorage.getItem("username"))
        console.log(userData);
        setTimeout(() => {
            document.getElementById("messageId").click()
        },)
    }, []);
    const connect = () => {
        let Sock = new SockJS('http://localhost/ws');
        stompClient = Stomp.over(Sock);
        stompClient.connect({}, onConnected, onError);

    }

    function getOne(name) {
        axios.post('http://localhost/api/message/' + name + '/' + userData.username + '/get-one').then(response => {
            console.log(response.data)
        })

    }

    function axios1(username) {
        setUserData({...userData, "username": username});
        axios.get('http://localhost/api/message/' + username + '/all-chat')
            .then(response => {
                console.log(response.data)
                getAllUserss(response.data)

            })
    }

    function deleteMessage(data) {
        axios
            .delete('http://localhost/api/message/' + data.id + '/delete-message',)
            .then(response => {
                openDeleteModal()
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
    }

    const onConnected = () => {
        setUserData({...userData, "connected": true});
        stompClient.subscribe('/chatroom/public', function () {
            try {
                const newUser = {
                    senderName: userData.username, receiverName: '', message: '', status: 'JOIN', id: 0

                };

                onMessageReceived(newUser);


            } catch (e) {
                console.error(e);
            }
        });

        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }
    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username, status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (newUser) => {
        switch (newUser.status) {
            case "JOIN":
                if (!privateChats.get(newUser.senderName)) {
                    privateChats.set(newUser.senderName, []);
                    setPrivateChats(new Map(privateChats));
                    console.log(privateChats)
                }
                break;
            case "MESSAGE":
                publicChats.push(newUser);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);

    }

    const handleMessage = (event) => {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    }


    const sendPrivateValue = () => {
        if (stompClient && userData.message.trim() !== '') {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                date: '',
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }

            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData, message: ""});
        }
    };


    const handleUsername = (event) => {
        const {value} = event.target;
        setUserData({...userData, "username": value});
    }
    const handleOnClick = (chat) => {
        openDeleteModal();
        setData(chat)
    }

    const registerUser = () => {
        connect();
    }
    const getAllUserss = (response) => {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
            if (privateChats.get(response[i].senderName)) {
                privateChats.get(response[i].senderName).push(response[i]);
                // privateChats.get(response[i].receiverName).push(response[i]);
                setPrivateChats(new Map(privateChats));
            } else {
                let list = [];
                list.push(response[i]);
                privateChats.set(response[i].senderName, list);
                privateChats.set(response[i].receiverName, list);
                setPrivateChats(new Map(privateChats));
            }
        }
    }

    function getAllUsers() {
        axios.get('http://localhost/api/v2/user/all', config).then((res) => {
            console.log(res.data.object)
            setUsers(res.data.object)
        }).catch((e) => {
            window.location.replace('http://localhost:3000/login')
        })
    }

    const openSearchbar = () => {
        setSearch(!search);
        document.getElementById("searchbar").style.display = search ? "none" : "block";
    }
    return (<>
        <Sidebar/>
        <div className="container">
            <Link to={'/' + username} id="profile"/>
            {/*<Link to={'/message/' + username} id="message"/>*/}
            {userData.connected ? <div className="chat-box">
                <div className="col-5 col-main">
                    <div className="member-list">
                        <h6 className="username">{userData.username}</h6>
                        <svg onClick={() => {
                            openSearchModal();
                            getAllUsers();
                        }} aria-label="New message" className="newMessage"
                             color="rgb(245, 245, 245)"
                             fill="rgb(245, 245, 245)" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <title>New message</title>
                            <path
                                d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952"
                                fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"></path>
                            <path
                                d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z"
                                fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="2"></path>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2" x1="16.848" x2="20.076" y1="3.924" y2="7.153"></line>
                        </svg>
                        <ul onClick={userUrl}>
                            {[...privateChats.keys()].map((name, index) => (
                                <li onClick={() => setTab(username !== name && name)}
                                    className={`member ${tab === name && "active"} ${username === name ? "d-none" : ""}`}
                                    key={index}>{username !== name ? name : null}</li>))}
                        </ul>
                    </div>

                </div>
                {tab === "CHATROOM" && <div className="chat-content">
                    <ul className="chat-messages">
                        {publicChats.map((chat, index) => (
                            <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                {chat.senderName !== userData.username &&
                                    <div className="avatar">{chat.senderName}</div>}
                                <div className="message-data">{chat.message}</div>
                                {chat.senderName === userData.username &&
                                    <div className="avatar self">{chat.senderName}</div>}
                            </li>))}
                    </ul>

                </div>}
                {tab !== "CHATROOM" && <div className="chat-content">
                    <ul className="chat-messages">
                        {[...privateChats.get(tab)].map((chat, index) => (
                            <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                {chat.senderName !== userData.username && <div className="avatar">
                                    {chat.senderName}
                                </div>}
                                <div className="message-data">{chat.message}</div>
                            </li>))}
                    </ul>
                    <div className="send-message">
                        <input type="text" className="input-message" placeholder="Message..."
                               value={userData.message} onChange={handleMessage}/>
                        <button type="submit" className="send-button" onClick={sendPrivateValue}>Send</button>
                    </div>
                </div>}
            </div> : <div className="connect">
                <input
                    id="user-name"
                    placeholder="Enter your name"
                    name="userName"
                    value={sessionStorage.getItem("username")}
                    onChange={handleUsername}
                    margin="normal"
                />
                <button type="submit" id="messageId" onClick={registerUser}>
                    connect
                </button>
            </div>}
            <Modal isOpen={deleteModal} toggle={openDeleteModal}>
                <ModalHeader toggle={openDeleteModal}>Delete Message</ModalHeader>
                <ModalBody>
                    Siz haqiqatdan ham "{data.message}" ushbu habarni uchirmokchimisiz ?
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={openDeleteModal}>Close</Button>
                    <Button color="danger" onClick={() => deleteMessage(data)}>Delete</Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={searchModal} toggle={openSearchModal}>
                <ModalHeader toggle={openSearchModal}>
                    <div className="searchbar-head">
                        <h5 style={{color: "black"}}>Search</h5>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchValue}
                            onChange={handleInputChange}
                            style={{backgroundColor: "white", color: "black"}}
                        />
                    </div>
                    <div className="searchbar-body">
                        {filteredUsers.map(user => (<div key={user.id}>
                            <div className="follower_result">
                                {user.attachmentId == null ? (<img alt='' src={profileImg}/>) : (
                                    <ImageDisplay isPost={false} id={user.attachmentId}/>)}
                                <div className="follower_info">
                                    <a href={`http://localhost:3000/${user.username}`}>{user.username}</a>
                                    <br/>
                                    <span>{user.fullName}</span>
                                </div>
                            </div>
                        </div>))}
                    </div>
                </ModalHeader>
                <ModalFooter>
                    <Button color="secondary" onClick={openSearchModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
    </>)
}

export default Message