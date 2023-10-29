import React, { useContext, useEffect, useState } from "react";
import FormInput from "../../components/FormInput";
import { toast } from "react-toastify";
import { getError } from "../../components/getError";
import axios from "axios";
import { Store } from "../../store";
import { useNavigate, useParams } from "react-router-dom";

const ResettingPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  console.log(token);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;
  const url = process.env.REACT_APP_SERVER_URL;
  useEffect(() => {
    if (userInfo || !token) {
      navigate("/");
    }
  }, [navigate, userInfo, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${url}/users/reset-password`, {
        password,
        token,
      });
      navigate("/loginpage");
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className='ForgottenPassword'>
      <h1>Forgotten Password</h1>
      <form onSubmit={submitHandler}>
        <FormInput
          label='Password'
          type='password'
          placeholder='Enter New Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormInput
          label='Confirm Password'
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default ResettingPassword;
