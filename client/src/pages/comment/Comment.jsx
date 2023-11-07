import "./Comment.css";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
// import Post from "../../components/post/Post";
import SendSharpIcon from "@mui/icons-material/SendSharp";
// import { format } from "timeago.js";
import { format } from "date-fns";
import { ArrowBack } from "@material-ui/icons";
import { Store } from "../../store";
import { useNavigate } from "react-router-dom";
import Post from "../../components/post/Post";

const Comment = () => {
  const scrollRef = useRef();
  const inputRef = useRef(null);
  const url = process.env.REACT_APP_SERVER_URL;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const postId = useParams().postId;
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${url}/posts/${postId}`);
        setPost(data);
        setAllComments(data.comments);
        setLike(data.likes.length);
        setComments(data.comments.length);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPost();
  }, [postId, url]);
  function containsOnlyWhiteSpace(inputValue) {
    return /^\s*$/.test(inputValue);
  }
  const commentHandler = async (e) => {
    e.preventDefault();
    if (!post || containsOnlyWhiteSpace(commentText)) return;
    try {
      const { data } = await axios.put(
        `${url}/posts/` + post._id + "/comments",
        {
          userId: userInfo._id,
          msg: commentText,
        }
      );
      setAllComments([...allComments, data]);
    } catch (err) {
      console.log(err);
    }
    setCommentText("");
  };
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behaviour: "smooth" });
    inputRef?.current.focus();
  }, [allComments]);
  return (
    <div className='sections'>
      <div className='upperContainer'>
        <ArrowBack onClick={() => navigate("/")} />
      </div>
      <div className='commentTop'>
        <div className='chatBoxWTop'>
          {post && <Post post={post} lik={like} comment={comments} />}
          {allComments &&
            allComments.map((comment) => (
              <div ref={scrollRef} className='message'>
                <div ref={scrollRef} key={comment} className='messageTop'>
                  {
                    <img
                      className='messageImg'
                      src={
                        comment.img ? comment?.img : PF + "person/noAvatar.png"
                      }
                      alt='comment img'
                    />
                  }
                  <div className='commentText'>
                    <p>{comment.username}</p>
                    <h3>{comment.msg}</h3>
                    <span>
                      {format(new Date(comment.date), "yyyy-MM-dd hh:mm:ss a")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className='chatBoxBottom'>
        <input
          type='text'
          ref={inputRef}
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
          className='chatBoxInput'
          placeholder='write your message'
        />
        <SendSharpIcon
          onClick={commentHandler}
          className='chatSubmitbtn icon'
        />{" "}
      </form>
    </div>
  );
};

export default Comment;
