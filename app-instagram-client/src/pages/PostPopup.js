import '../style/postModal.css'
import axios from "axios";
import React, {useEffect, useState} from "react";
import ImageDisplay from "./ImageDisplay";
import Like from "./Like";
import jwt_decode from "jwt-decode";
import "../style/postModal.css"
import Comment from "./Comment";
import {Container} from "reactstrap";


const PostPopup = ({onClose, postId}) => {
    const token = localStorage.getItem('jwtToken');
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    const decodedToken = jwt_decode(token);
    const username = decodedToken.sub
    useEffect(() => {
        sendRequestToBackend()
        getComment()
    }, [])
    const [onePost, setOnePost] = useState('')
    const [comments, setComments] = useState([])
    const rootComments = comments.filter(comment => comment.commentId === null)
    const getReplies = commentId => {
        return comments.filter(comment => comment.commentId === commentId).sort((a, b) => new Date(a.timestamp).getTime()
            - new Date(b.timestamp).getTime())
    }

    function sendRequestToBackend() {
        axios.get(`http://localhost/api/post/getOne/` + postId, config).then((resp) => {
            setOnePost(resp.data.object)
            console.log(resp.data.object)
        })
    }

    function getComment() {
        axios.get(`http://localhost/api/comment/get/` + postId, config).then((resp) => {
            setComments(resp.data.object)
            console.log(resp.data)
        })
    }


    function deletePost() {
        axios.delete(`http://localhost/api/post/delete/${postId}`, config).then((resp) => {
            window.location.reload();
        })
    }


    function sendComment() {
        let comment = document.getElementById("postComment").value;
        console.log(comment)
        axios.post("http://localhost/api/comment/add/" + postId, {
            text: comment
        }, config).then(res => console.log(res));
    }

    return (
        <div className="popup">
            <Like postId={onePost.id}/>

            <div className="popup-content">
                <div className="row no-padding m-0">
                    <div className="col-10">
                        <h4 className="blobCaption">{onePost.caption}</h4>
                    </div>
                    <div className="col-2 popup-header-btn">
                        <button className="post-popup-header-button" onClick={onClose}>
                            <div className="follower_btn_div">
                                <svg aria-label="Close" className="x1lliihq x1n2onr6" color="rgb(245, 245, 245)"
                                     fill="rgb(245, 245, 245)" height="18" role="img" viewBox="0 0 24 24" width="18">
                                    <title>Close</title>
                                    <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor"
                                              strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>
                                    <line fill="none" stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="post-popup-body">
                    <div className="row m-0 no-padding">
                        <div className="col-7">
                            <div className="QwertyBlob">
                                <div className="blobSvgDelete">
                                    {
                                        onePost.user === username ? (
                                                <button onClick={deletePost} className="blobDeleteBtn">
                                                    <div onClick={onClose}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                             fill="currentColor"
                                                             className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                            <path
                                                                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                                                        </svg>
                                                    </div>
                                                </button>)
                                            : null
                                    }
                                </div>
                                <ImageDisplay  isPost={true} id={onePost.attachmentId}/>
                            </div>
                        </div>
                        <div className="col-5">
                            <Container>

                                <div className="comments">
                                    {rootComments.map(rootComment => (
                                            <Comment
                                                key={rootComment.id}
                                                comment={rootComment}
                                                replies={getReplies(rootComment.id)}
                                            />
                                        )
                                    )}
                                </div>

                            </Container>
                            <div className="input_comments_1" >
                                <input id="postComment" className="postComment" placeholder="Add a comment"/>
                                <button onClick={sendComment} className="send_comment_posts">Post</button>

                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            );
            };

            export default PostPopup;
