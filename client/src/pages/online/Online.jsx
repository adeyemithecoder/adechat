import { useContext, useEffect, useRef, useState } from "react";
import "./online.css";
import { Store } from "../../store";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../../components/getError";
import { Topbar } from "../../components/topbar/Topbar";
import Messenger from "../chattings/Messenger";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
// import { format } from "timeago.js";
import { format } from "date-fns";
export default function Online() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const url = process.env.REACT_APP_SERVER_URL;
  const [users, setUsers] = useState([]);
  const [curChat, setCurChat] = useState(undefined);
  const navigate = useNavigate();
  const socket = useRef();
  const [typing, setTyping] = useState(false);
  let notification = 0;
  const [newMessages, setNewMessages] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(true);
  useEffect(() => {
    if (userInfo) {
      socket.current = io(url);
      socket.current.emit("add-user", userInfo._id);
    }
  }, [userInfo, url]);
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    const getMessage = async () => {
      if (!userInfo) return;
      try {
        const { data } = await axios.post(`${url}/message/getMessage`, {
          from: userInfo._id,
          to: curChat?._id,
        });
        setMessages(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    getMessage();
  }, [curChat, userInfo, url]);
  useEffect(() => {
    // let check = [userInfo?._id, curChat?._id];
    if (socket.current) {
      socket.current.on("msg-received", (data) => {
        setArrivalMessage({ messages: data, myOwn: false, messageCount: 1 });
      });
      let timeout;
      socket.current.on("typingFromSocket", (data) => {
        setTyping(true);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          setTyping(false);
        }, 1000);
      });
    }
  }, [curChat]);
  useEffect(() => {
    socket.current.on("notification", (data) => {
      // const alreadyRead = check.some((id) => id === data.senderId);
      if (curChat?._id && curChat?._id === data.senderId) return;
      console.log(notification);
      notification++;
      console.log(notification);
      // setNotification((prev) => [...prev, data]);
      // setNotification((prev) => [{ ...data, isRead: true }, ...prev]);

      //  else {
      //   setNotification((prev) => [data, ...prev]);
      // }
    });
  }, [notification, curChat]);

  useEffect(() => {
    const getAlluser = async () => {
      if (!userInfo) return;
      try {
        const { data } = await axios.get(
          `${url}/users/alluser/${userInfo._id}`
        );
        setUsers(data);
      } catch (err) {
        setError(getError(err));
        toast.error(getError(err));
      } finally {
        setIsloading(false);
      }
    };
    getAlluser();
  }, [userInfo, url]);
  useEffect(() => {
    if (!userInfo) navigate("/loginpage");
  }, [userInfo, navigate]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleSelect = (index, user) => {
    handleChangeCurChat(user);
  };
  const getMessage = (e) => {
    setNewMessages(e.target.value);
    socket.current.emit("typing", curChat._id);
    socket.current.on("typingFromSocket", (data) => {});
  };

  const handleChangeCurChat = (chat) => {
    setCurChat(chat);
  };
  const noCurChar = (chat) => {
    setCurChat(undefined);
  };
  return (
    <>
      <div className='onlinecontrainer container'>
        <div className='sections'>
          {curChat ? (
            <Messenger
              newMessages={newMessages}
              typing={typing}
              messages={messages}
              getMessage={getMessage}
              socket={socket}
              setMessages={setMessages}
              setNewMessages={setNewMessages}
              curChat={curChat}
              noCurChar={noCurChar}
            />
          ) : (
            <div className='messagecontrainer'>
              <Topbar />
              <div>
                <h4 className='rightbarTitle'>Online Friends</h4>
                {isloading ? (
                  <LoadingBox />
                ) : error ? (
                  <MessageBox>{error}</MessageBox>
                ) : (
                  <ul className='rightbarFriendList'>
                    {users?.map((user, i) => (
                      <li
                        key={i}
                        onClick={() => handleSelect(i, user)}
                        className='rightbarFriend'
                      >
                        <div className='nameImg'>
                          <div className='rightbarProfileImgContainer'>
                            <img
                              className='rightbarProfileImg'
                              src={
                                user?.profilePicture
                                  ? user.profilePicture
                                  : PF + "person/noAvatar.png"
                              }
                              alt=''
                            />
                            <span
                              className={
                                user.online ? "rightbarOnline" : "offline "
                              }
                            ></span>
                          </div>
                          <div className='rightbarUsername'>
                            <span>{user.username}</span>
                            <p className='rightbarUsername'>
                              {user.online
                                ? "online"
                                : user.onlineTime
                                ? "left since " + user.onlineTime
                                : "left since " +
                                  format(
                                    new Date(user.updatedAt),
                                    "yyyy-MM-dd hh:mm:ss a"
                                  )}
                            </p>
                          </div>
                        </div>
                        <div className='notification'>
                          {/* <span className='notificationCount'>
                          {user.messageCount}
                        </span> */}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
