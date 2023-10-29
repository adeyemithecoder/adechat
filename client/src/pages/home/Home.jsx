import "./home.css";
import { Store } from "../../store";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Topbar } from "../../components/topbar/Topbar";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../../components/getError";
import Share from "../../components/share/Share";
import Post from "../../components/post/Post";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";

export default function Home() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const url = process.env.REACT_APP_SERVER_URL;
  const [posts, setPosts] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userInfo) return;
      try {
        const { data } = await axios.get(`${url}/posts`);
        setPosts(
          data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (err) {
        toast.error(getError(err));
        setError(getError(err));
      } finally {
        setIsloading(false);
      }
    };
    fetchPosts();
  }, [userInfo, url]);
  useEffect(() => {
    if (!userInfo) navigate("/register");
  }, [userInfo, navigate]);
  return (
    <>
      <Topbar display='home' />
      <div className='homeContainer container'>
        {isloading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : (
          <div className='sections'>
            <Share />

            {posts.map((p) => (
              <Post key={p._id} post={p} />
            ))}
          </div>
        )}{" "}
      </div>
    </>
  );
}
