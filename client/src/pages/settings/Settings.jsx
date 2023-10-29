import React, { useContext, useState } from "react";
import "./Settings.css";
import { ArrowBack, Create, PowerSettingsNew } from "@material-ui/icons";
import { Store } from "../../store";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
  const { dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
  });

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout")) return;
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  return (
    <div>
      <div className='upperContainer'>
        <ArrowBack fontSize='large' onClick={() => navigate("/")} />
      </div>
      <div className='settings-container sections'>
        {/* <Back /> */}
        <h1>Settings</h1>
        <Link to='/editpage' className='settings-items'>
          <Create />
          <span>Edit your profile </span>
        </Link>
        <div onClick={handleLogout} className='settings-items'>
          <PowerSettingsNew />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
