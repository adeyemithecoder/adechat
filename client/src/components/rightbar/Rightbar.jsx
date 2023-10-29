import "./rightbar.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Store } from "../../store";
import { toast } from "react-toastify";
import { getError } from "../getError";
export default function Rightbar({ user, handleChangeCurChat }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  // const [followed, setFollowed] = useState(
  //   userInfo?.followings.includes(user?.id)
  // );
  // useEffect(() => {
  //   const getFriends = async () => {
  //     if (!userInfo) return;
  //     try {
  //       const friendList = await axios.get(
  //         "http://localhost:5000/api/users/friends/" + userInfo._id
  //       );
  //       setFriends(friendList.data);
  //     } catch (err) {
  //       toast.error(getError(err));
  //       window.alert(getError(err));
  //     }
  //   };
  //   getFriends();
  // }, [userInfo]);
  useEffect(() => {
    const getAlluser = async () => {
      if (!userInfo) return;
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/users/alluser/${userInfo._id}`
        );
        setUsers(data);
      } catch (err) {
        toast.error(getError(err));
        window.alert(getError(err));
      }
    };
    getAlluser();
  }, [userInfo]);

  // const handleClick = async () => {
  //   try {
  //     if (followed) {
  //       await axios.put(`/users/${user._id}/unfollow`, {
  //         userId: userInfo?._id,
  //       });
  //       ctxDispatch({ type: "UNFOLLOW", payload: user._id });
  //     } else {
  //       await axios.put(`/users/${user._id}/follow`, {
  //         userId: userInfo?._id,
  //       });
  //       ctxDispatch({ type: "FOLLOW", payload: user._id });
  //     }
  //     setFollowed(!followed);
  //   } catch (err) {}
  // };

  // const HomeRightbar = () => {
  //   return (
  //     // <>
  //     //   <div className='birthdayContainer'>
  //     //     {/* <ArrowBackSharpIcon fontSize='large' /> */}
  //     //   </div>
  //     //   {/* <img className='rightbarAd' src={`${PF}assets/ad.png`} alt='' /> */}
  //     //   <h4 className='rightbarTitle'>Online Friends</h4>
  //     //   <ul className='rightbarFriendList'>
  //     //     {users?.map((u, i) => (
  //     //       <Online
  //     //         key={u._id}
  //     //         user={u}
  //     //         i={i}
  //     //         handleChangeCurChat={handleChangeCurChat}
  //     //       />
  //     //     ))}
  //     //   </ul>
  //     // </>
  //   );
  // };

  const ProfileRightbar = () => {
    return (
      <>
        {/* {user.username !== userInfo?.username && (
          <button className='rightbarFollowButton' onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )} */}
        <h4 className='rightbarTitle'>User information</h4>
        <div className='rightbarInfo'>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>City:</span>
            <span className='rightbarInfoValue'>{userInfo?.city}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>From:</span>
            <span className='rightbarInfoValue'>{userInfo?.from}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>Relationship:</span>
            <span className='rightbarInfoValue'>{userInfo?.relationship}</span>
          </div>
        </div>
        <h4 className='rightbarTitle'>User friends</h4>
        <div className='rightbarFollowings'>
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className='rightbarFollowing'>
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=''
                  className='rightbarFollowingImg'
                />
                <span className='rightbarFollowingName'>{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className='rightbar'>
      <div className='rightbarWrapper'>
        {/* {user ? <ProfileRightbar /> : <HomeRightbar />} */}
      </div>
    </div>
  );
}
