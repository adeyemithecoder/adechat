import React, { useContext, useEffect, useState } from "react";
import "./EditUser.css";
import FormInput from "../../components/FormInput";
import { useNavigate } from "react-router-dom";
import { Store } from "../../store";
import { toast } from "react-toastify";
import { getError } from "../../components/getError";
import axios from "axios";

const ForgottenPassword = () => {
  const [email, setEmail] = useState("");
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const url = process.env.REACT_APP_SERVER_URL;
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${url}/users/forget-password`, {
        email,
      });
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <div className='ForgottenPassword'>
      <h1>Forgotten Password</h1>
      <form onSubmit={submitHandler}>
        <FormInput
          label='Email'
          type='text'
          placeholder='Enter Youe Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default ForgottenPassword;
