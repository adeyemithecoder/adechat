import "./Messenger.css";
import Message from "./Message";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { toast } from "react-toastify";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Picker from "emoji-picker-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Store } from "../../store";
import axios from "axios";
import { getError } from "../../components/getError";
import { ArrowBack, CameraAlt } from "@material-ui/icons";
// import { Back } from "../../components/topbar/Topbar";

const Messenger = ({
  curChat,
  getMessage,
  noCurChar,
  socket,
  messages,
  newMessages,
  typing,
  setMessages,
  setNewMessages,
}) => {
  const [showEmojiPi, setShowEmojiPi] = useState(false);
  const inputRef = useRef(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url = process.env.REACT_APP_SERVER_URL;
  const { state } = useContext(Store);
  const scrollRef = useRef();
  const { userInfo } = state;
  let [count, setCount] = useState(0);

  const EmojiPicker = () => {
    setShowEmojiPi(!showEmojiPi);
  };
  const emojiClicked = (emoji) => {
    let message = newMessages;
    message += emoji.emoji;
    setNewMessages(message);
  };
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behaviour: "smooth" });
    inputRef?.current?.focus();
  }, [messages]);
  function containsOnlyWhiteSpace(inputValue) {
    return /^\s*$/.test(inputValue);
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInfo || containsOnlyWhiteSpace(newMessages)) return;
    const result = {
      from: userInfo._id,
      to: curChat._id,
      message: newMessages,
      messageCount: 1,
    };
    try {
      const { data } = await axios.post(`${url}/message/sendMessage`, result);
      const user = await axios.get(`${url}/users?userId=${curChat._id}`);
      console.log(Number(user.data.messageCount));
      setCount(1 + Number(user.data.messageCount));
      // await axios.put(`/users/${curChat._id}/update`, {
      //   messageCount: Number(user.data.messageCount) + 1,
      // });
      console.log(count);
      socket.current.emit("send-msg", {
        to: curChat._id,
        from: userInfo._id,
        messages: newMessages,
      });
      setMessages([...messages, data]);
      setNewMessages("");
    } catch (err) {
      toast.error(getError(err));
      window.alert(getError(err));
    }
  };
  return (
    <div className='chatBoxWrapper'>
      <div className='upperContainer'>
        <ArrowBack fontSize='large' onClick={noCurChar} />
        <img
          className='messageImg'
          src={
            curChat.profilePicture
              ? curChat?.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt='profilePicture'
        />
        <span>
          <h2>{curChat?.username}</h2>
          <p> {typing ? "typing..." : ""}</p>
        </span>
      </div>

      <div className='chatBoxWTop'>
        {messages?.map((message, i) => (
          <div key={i} ref={scrollRef}>
            <Message
              curChat={curChat}
              msg={message?.messages}
              own={message?.myOwn}
              updatedAt={message?.updatedAt}
              messages={messages}
            />
          </div>
        ))}
      </div>
      <div className='emoji-container'>
        {" "}
        {showEmojiPi && (
          <Picker className='emoji-picker-react' onEmojiClick={emojiClicked} />
        )}
      </div>
      <form onSubmit={handleSendMessage} className='chatBoxBottom'>
        <div className='emoji'>
          <InsertEmoticonIcon onClick={EmojiPicker} />
        </div>
        <input
          type='text'
          ref={inputRef}
          value={newMessages}
          onChange={getMessage}
          className='chatBoxInput'
          placeholder='write your message'
        />
        <SendSharpIcon onClick={handleSendMessage} className='icon send' />{" "}
      </form>
    </div>
  );
};

export default Messenger;
