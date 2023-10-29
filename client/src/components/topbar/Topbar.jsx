import "./topbar.css";
import { Search, Home, MoreVert, ArrowBack } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "../../store";
import { useContext } from "react";
export const Topbar = ({ display }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [activeNav, setActiveNav] = useState("");
  useEffect(() => {}, [activeNav]);

  console.log(activeNav);
  return (
    <header className='header container'>
      <section className='section sections'>
        <div className={!display ? "hidden" : "upper_section"}>
          <div>
            <Link to='/' className='AdeChat'>
              AdeChat
            </Link>
          </div>
          <ul>
            <li>
              <Link to='footer' className='link'>
                <Search className='icon' />
              </Link>
            </li>
            <li>
              <Link to='settings' className='link'>
                <MoreVert className='icon' />
              </Link>
            </li>
          </ul>

          {/* <img src={require("./images/chatApp.jpg")} width={40} alt='' /> */}
        </div>
        <div className='lower_section'>
          <ul>
            <li>
              <Link
                onClick={() => setActiveNav("home")}
                className={activeNav === "home" ? "active link" : "link"}
                to='/'
              >
                <span className='item'>Home</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setActiveNav("friends")}
                to='/online'
                className={activeNav === "friends" ? "active link" : "link"}
              >
                <span className='item'>Chats</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${userInfo?._id}`}
                onClick={() => setActiveNav("message")}
                className={activeNav === "message" ? "active link" : "link"}
              >
                <span className='item'>Profile</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to='testi'
                onClick={() => setActiveNav("allUser")}
                className={activeNav === "allUser" ? "active link" : "link"}
              >
                <span className='item'>Friends</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </section>
    </header>
  );
};
// export const Back = (curChat, typing, PF, noCurChar) => {
//   return (
//     <div className='upperContainer'>
//       <ArrowBack fontSize='large' onClick={noCurChar} />
//       <img
//         className='messageImg'
//         src={PF + curChat?.profilePicture}
//         alt='profilePicture'
//       />
//       <span>
//         <h2>{curChat?.username}</h2>
//         <p> {typing ? "typing..." : ""}</p>
//       </span>
//     </div>
//   );
// };
