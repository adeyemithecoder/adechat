// import { Close } from "@material-ui/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import RegistrationPage from "./pages/login/RegistrationPage";
import LoginPage from "./pages/login/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import Online from "./pages/online/Online";
import { useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Store } from "./store";
import axios from "axios";
import { getError } from "./components/getError";
// import { format } from "timeago.js";
import Settings from "./pages/settings/Settings";
import Check from "./components/Check";
import EditUser from "./pages/changes/EditUser";
import ForgottenPassword from "./pages/changes/ForgottenPassword";
import ResettingPassword from "./pages/changes/ResettingPassword";
import Comment from "./components/comment/Comment";

function App() {
  const url = process.env.REACT_APP_SERVER_URL;
  const socket = useRef();
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const update = async () => {
      if (userInfo) {
        socket.current = io(url);
        socket.current.emit("add-user", userInfo._id);
        socket.current.on("alluser", async (data) => {
          const connectedusers = data.map((user) => user.userId);
          const res = await axios.get(`${url}/users/onlinuser`);
          const onlineUsers = res.data.map((user) => user._id);
          const logOutUser = onlineUsers.filter(function (n) {
            return !this.has(n);
          }, new Set(connectedusers));
          try {
            if (!logOutUser[0]) return;
            await axios.put(`${url}/users/${logOutUser[0]}/update`, {
              online: false,
            });
          } catch (err) {
            getError(err);
          }
        });
        try {
          await axios.put(`${url}/users/${userInfo._id}/update`, {
            online: true,
          });
        } catch (err) {
          getError(err);
        }
        socket.current.on("offline", async (data) => {
          if (!data) return;
          function formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var strTime = hours + ":" + minutes + " " + ampm;
            return strTime;
          }
          const id = data.userId;
          try {
            await axios.put(`${url}/users/${id}/update`, {
              online: false,
              onlineTime: formatAMPM(new Date()),
            });
          } catch (err) {
            getError(err);
          }
        });
      }
    };
    update();
  }, [userInfo, url]);

  return (
    <div className='App'>
      <ToastContainer position='bottom-center' limit={1} />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/online' element={<Online />} />
          <Route path='/loginpage' element={<LoginPage />} />
          <Route path='/profile/:userId' element={<Profile />} />
          <Route path='/comment/:postId' element={<Comment />} />
          <Route path='/forgottenpassword' element={<ForgottenPassword />} />
          <Route
            path='/reset-password/:token'
            element={<ResettingPassword />}
          />
          <Route
            path='/settings'
            element={
              <Check>
                <Settings />
              </Check>
            }
          ></Route>
          <Route
            path='/editpage'
            element={
              <Check>
                <EditUser />
              </Check>
            }
          ></Route>
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
