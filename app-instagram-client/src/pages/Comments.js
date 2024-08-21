import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import "../style/index.css"
const Comments = ({ commentsUrl, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = comments.filter(
    (comment) => comment.commentId === null
  );
  const getReplies = (commentId) =>
    setComments()
      .filter((comment) => comment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  // const addComment = (text, commentId) => {
  //   createCommentApi(text, commentId).then((comment) => {
  //     setBackendComments([comment, ...backendComments]);
  //     setActiveComment(null);
  //   });
  // };



  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            currentUserId={currentUserId}
          />

        ))}
      </div>
    </div>
  );
};

export default Comments;
