import { useContext, useEffect } from "react";
import { Store } from "../../store";
import "./Message.css";
import { format } from "timeago.js";

const Message = ({ curChat, own, msg, updatedAt, key }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { state } = useContext(Store);
  const { userInfo } = state;
  return (
    <div key={key} className={own ? "message own" : "message"}>
      <div className='messageTop'>
        {own ? (
          <img
            className='messageImg'
            src={
              userInfo.profilePicture
                ? PF + userInfo?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt='profilePicture'
          />
        ) : (
          <img
            className='messageImg'
            src={
              curChat.profilePicture
                ? PF + curChat?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt='profilePicture'
          />
        )}
        <div className='messageTextContainer'>
          <p className='messageText'>{msg}</p>
          <span className='time'>{format(updatedAt)} </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
