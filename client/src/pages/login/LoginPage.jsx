import { UseForm } from "../../components/useForm";
import FormInput from "../../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../store";
import axios from "axios";
import { getError } from "../../components/getError";
import "./RegistrationPage.css";
import LoadingBox from "../../components/LoadingBox";
const RegistrationPage = () => {
  const { dispatch: ctxDispatch } = useContext(Store);
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_SERVER_URL;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const initialValues = {
    username: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  };
  const { values, handleInputChange } = UseForm(initialValues);
  useEffect(() => {
    if (userInfo) navigate("/");
  }, [userInfo, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("login");
      setIsloading(true);
      const { data } = await axios.post(`${url}/users/signin`, values);
      ctxDispatch({ type: "USER_SIGNIN", payload: data.user });
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      console.log(getError(err));
      toast.error(getError(err));
    } finally {
      setIsloading(false);
    }
  };
  return (
    <div className='register '>
      <div className='grid1'>
        <div className='welcome'>
          <h1 className='welcomh1'>
            Welcome to AdeChat where you can connect with friend all over the
            world.
          </h1>
        </div>
      </div>
      <div className='grid2'>
        <form className='form-control' onSubmit={handleSubmit}>
          {" "}
          <h1>Login Here</h1>
          <FormInput
            label='Email'
            type='email'
            placeholder='Email'
            name='email'
            value={values.email}
            onChange={handleInputChange}
          />
          <FormInput
            label='Password'
            type='password'
            placeholder='Password'
            name='password'
            value={values.password}
            onChange={handleInputChange}
          />
          <button className={isloading && "opacity"}>
            {" "}
            {isloading && <LoadingBox />}Submit
          </button>
          <p className='Forgottenpassword link'>
            Forgotten password?{" "}
            <Link className='link' to='/forgottenpassword'>
              Clich here
            </Link>
          </p>
          <p className='link'>
            Don't Have An Account?{" "}
            <Link className='link' to={"/register"}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
