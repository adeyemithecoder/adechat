import React, { useState } from "react";
import { NotListedLocation } from "@material-ui/icons";

const Dialog = ({ setOpenDialog, handleLogout }) => {
  return (
    <div className='DialogBackground'>
      <div className='DialogContainer'>
        <div className='CloseDialog'>
          {" "}
          <button onClick={() => setOpenDialog(false)}>X</button>
        </div>
        <h1>Are you sure you want to log out</h1>
        <h2>
          <NotListedLocation className='question' fontSize='large' />
        </h2>{" "}
        <div className='action'>
          <button className='red' onClick={() => setOpenDialog(false)}>
            No
          </button>
          <button onClick={handleLogout}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
