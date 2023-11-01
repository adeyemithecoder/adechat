import React, { useContext, useState } from "react";
import "./Settings.css";
import { ArrowBack, Create, PowerSettingsNew } from "@material-ui/icons";
import { Store } from "../../store";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "../../components/Dialog";

const Settings = () => {
  const { dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    // if (!window.confirm("Are you sure you want to logout")) return;
    setOpenDialog(true);
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div>
      {openDialog ? (
        <Dialog
          openDialog={openDialog}
          handleLogout={handleLogout}
          setOpenDialog={setOpenDialog}
        />
      ) : (
        <div>
          {" "}
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
            <div onClick={() => setOpenDialog(true)} className='settings-items'>
              <PowerSettingsNew />
              <span>Log Out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
