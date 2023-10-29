import "./profile.css";
import { Topbar } from "../../components/topbar/Topbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Store } from "../../store";
import { toast } from "react-toastify";
import { getError } from "../../components/getError";
import Post from "../../components/post/Post";
import { Link } from "react-router-dom";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import {
  Call,
  DateRange,
  Email,
  FavoriteBorder,
  LocationOn,
  Person,
  School,
  Wc,
} from "@material-ui/icons";
import MessageBox from "../../components/MessageBox";
export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url = process.env.REACT_APP_SERVER_URL;
  const [user, setUser] = useState({});
  const userId = useParams().userId;
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const { state } = useContext(Store);
  const { userInfo } = state;
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
        window.alert(getError(err));
      }
    };
    console.log("object");
    fetchPosts();
  }, [userInfo, url]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/users?userId=${userId}`);
        setUser(res.data);
      } catch (err) {
        toast.error(getError(err));
        setError(getError(err));
      }
    };
    fetchUser();
  }, [userId, url]);
  return (
    <div className='sections'>
      <Topbar />
      {error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        <div className='profileRight'>
          <div className='profileRightTop'>
            <div className='profileCover'>
              <img
                className='profileCoverImg'
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt='coverPicture'
              />
              <img
                className='profileUserImg'
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=''
              />
              <h4 className='profileInfoName'>{user.username}</h4>
            </div>
            <div className='profileInfo'>
              <span className='profileInfoDesc'>{user.desc}</span>
            </div>
          </div>
          <div className='myProfile'>
            <h2>
              <Link to='/editpage'>
                {userId === userInfo._id && "Adit your Profile"}{" "}
              </Link>
            </h2>
            <div className='myProfileDetails'>
              <p>
                {" "}
                <Person />
                <span>
                  Name : <h3> {user.username}</h3>
                </span>
              </p>
              <p>
                {" "}
                <Email />{" "}
                <span>
                  Email :<h3> {user.email}</h3>
                </span>{" "}
              </p>
              <p>
                {" "}
                <DateRange />
                <span>
                  {" "}
                  Date of birth : <h3>{user.birthday}</h3>
                </span>{" "}
              </p>
              <p>
                <LocationOn />{" "}
                <span>
                  I am from : <h3>{user.from}</h3>
                </span>{" "}
              </p>
              <p>
                {" "}
                <OtherHousesIcon />
                <span>
                  {" "}
                  I am currently in : <h3>{user.city}</h3>
                </span>{" "}
              </p>
              <p>
                {" "}
                <FavoriteBorder />{" "}
                <span>
                  Relationship : <h3>{user.relationship}</h3>
                </span>{" "}
              </p>
              <p>
                {" "}
                <Wc />{" "}
                <span>
                  My gender : <h3> {user.gender}</h3>
                </span>{" "}
              </p>
              <p>
                {" "}
                <School />
                <span>
                  {" "}
                  I studied at : <h3>{user.school}</h3>
                </span>{" "}
              </p>
              <p>
                {" "}
                <Call />
                <span>
                  {" "}
                  Phone No : <h3>{user.phone}</h3>
                </span>{" "}
              </p>
            </div>
          </div>
          <div className='profileRightBottom'>
            {posts.map((p) => (
              <Post key={p._id} post={p} />
            ))}
            {/* <Rightbar user={user} /> */}
          </div>
        </div>
      )}

      {/* </div> */}
    </div>
  );
}