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

  return (
    <header className='header container'>
      <section className='section sections'>
        <div className={!display ? "hidden" : "upper_section"}>
          <div>
            <Link to='/' className='AdeChat link'>
              AdeChat
            </Link>
          </div>
          <ul>
            <li>
              <Link to='settings' className='link'>
                <MoreVert className='icon links' />
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
