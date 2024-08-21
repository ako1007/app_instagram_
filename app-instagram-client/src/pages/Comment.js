import CommentForm from "./CommentForm";
import profileImg from "../images/profileDemo.png";
import ImageDisplay from "./ImageDisplay";
import React, {useEffect, useState} from "react";
import axios from "axios";

const Comment = ({
                     comment,
                     replies,
                     setActiveComment,
                     activeComment,
                     updateComment,
                     deleteComment,
                     addComment,
                     commentId = null,
                     currentUserName,
                 }) => {
    const isEditing =
        activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === "editing";
    const isReplying =
        activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === "replying";
    const fiveMinutes = 300000;
    const timePassed = new Date() - new Date(comment.timestamp) > fiveMinutes;
    const canDelete =
        currentUserName === comment.user && replies.length === 0 && !timePassed;
    const canReply = Boolean(currentUserName);
    const canEdit = currentUserName === comment.user && !timePassed;
    const replyId = commentId ? commentId : comment.id;
    const timestamp = new Date(comment.timestamp).toLocaleDateString();
    const [userr, setUser] = useState('')
    const token = localStorage.getItem('jwtToken');
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };
    function getUserComment(user) {
        axios.get('http://localhost/api/v2/user/' + user, config)
            .then(response => {
                setUser(response.data.object)
            })
    }
    useEffect(() => {
        getUserComment();
    }, [])
    return (
        <div key={comment.id} className="comment">
            <div className="comment-image-container">
                <a href={""} className="user__ home_post_img">
                    <div>{userr.attachmentId == null ? <img alt='' src={profileImg}/> :
                        <ImageDisplay isPost={false} id={userr.attachmentId}/>}</div>
                </a>
                <div className="home_post_username">
                <a href={`/${userr.username}`} className="user__ home_post_img">{userr.username}</a>
                    <ImageDisplay isPost={false} id={userr.attachmentId}/>
            </div>
            </div>

            <div className="comment-right-part">
                <div className="comment-content">
                    <a href="" className="comment-author">{comment.userr}</a>
                    {/*<div className="comment-author">{comment.user}</div>*/}
                    <div className="time-comment">{timestamp}</div>
                </div>
                {!isEditing && <div className="comment-text">{comment.text}</div>}
                {isEditing && (
                    <CommentForm
                        submitLabel="Update"
                        hasCancelButton
                        initialText={comment.text}
                        handleSubmit={(text) => updateComment(text, comment.id)}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                <div className="comment-actions">
                    {canReply && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({id: comment.id, type: "replying"})
                            }
                        >
                            Reply
                        </div>
                    )}
                    {canEdit && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({id: comment.id, type: "editing"})
                            }
                        >
                            Edit
                        </div>
                    )}
                    {canDelete && (
                        <div
                            className="comment-action"
                            onClick={() => deleteComment(comment.id)}
                        >
                            Delete
                        </div>
                    )}
                </div>
                {isReplying && (
                    <CommentForm
                        submitLabel="Reply"
                        handleSubmit={(text) => addComment(text, replyId)}
                    />
                )}
                {replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => (
                            <Comment
                                comment={reply}
                                key={reply.id}
                                setActiveComment={setActiveComment}
                                activeComment={activeComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                addComment={addComment}
                                parentId={comment.id}
                                replies={[]}
                                currentUserName={currentUserName}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
