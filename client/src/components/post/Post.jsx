import "./post.css";
import { ThumbUp } from "@material-ui/icons";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { Store } from "../../store";

export default function Post({ post, comment, lik }) {
  const [like, setLike] = useState(post.likes?.length);
  const [comments, setComments] = useState(post.comments?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url = process.env.REACT_APP_SERVER_URL;
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    setIsLiked(post.likes?.includes(userInfo._id));
  }, [userInfo._id, post.likes]);
  useEffect(() => {
    if (!post.userId) return;
    const fetchUser = async () => {
      const res = await axios.get(`${url}/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post, url]);

  const likeHandler = () => {
    try {
      axios.put(`${url}/posts/` + post._id + "/like", { userId: userInfo._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="post container">
      <div className="postWrapper sections">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user._id}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.img} alt="Post Img" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked ? (
              <ThumbUp onClick={likeHandler} className="likeIcons" />
            ) : (
              <ThumbUpOffAltIcon onClick={likeHandler} className="likeIcons" />
            )}
            <span className="dislike"> {isLiked ? "dislike" : "like"} </span>
            <span className="postLikeCounter">
              {like ? like : lik} person like it
            </span>
          </div>
          <div className="postBottomRight">
            <Link to={`/comment/${post._id}`} className="postCommentText">
              {comments
                ? comments + "  " + "comments"
                : comment || "" + "  " + "comments"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
