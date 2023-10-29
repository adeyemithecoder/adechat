import { UseForm } from "../../components/useForm";
import FormInput from "../../components/FormInput";
import Radio from "../../components/Radio";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../store";
import "./RegistrationPage.css";
import { getError } from "../../components/getError";
import LoadingBox from "../../components/LoadingBox";
const RegistrationPage = () => {
  const url = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();
  const genderItems = [
    { id: "male", title: "Male" },
    { id: "female", title: "Female" },
    { id: "other", title: "Other" },
  ];
  const initialValues = {
    username: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  };
  const { values, handleInputChange } = UseForm(initialValues);
  const [isloading, setIsloading] = useState(false);
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) navigate("/");
  }, [userInfo, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsloading(true);
      await axios.post(`${url}/users/signup`, values);
      navigate("/loginpage");
      toast.success("Successfully Registered");
    } catch (err) {
      toast.error(getError(err));
      window.alert(getError(err));
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className='register '>
      <div className='grid1'>
        <h1>
          Welcome to AdeChat where you can connect with friend all over the
          world.
        </h1>
      </div>
      <div className='grid2'>
        <form className='form-control' onSubmit={handleSubmit}>
          {" "}
          <h1>Register</h1>
          <FormInput
            errMes='Username should be 3-16 characters and must not include any special character!'
            // label='Username'
            type='text'
            placeholder='Username'
            name='username'
            required={true}
            pattern='^[A-Za-z0-9]{3,16}$'
            value={values.username}
            onChange={handleInputChange}
          />
          <FormInput
            errMes='This email is not valid'
            // label='Email'
            type='email'
            placeholder='Email'
            name='email'
            required={true}
            value={values.email}
            onChange={handleInputChange}
          />
          <FormInput
            type='date'
            placeholder='Birthday'
            name='birthday'
            value={values.birthday}
            onChange={handleInputChange}
          />
          <FormInput
            errMes='Password should be 8-20 characters and include atleast 1 number, 1 letter and 1 special character'
            type='password'
            placeholder='Password'
            name='password'
            required={true}
            pattern='^(?=.*[0-9])(?=.[A-Za-z])(?=.*[!@#$%^&.,?*])[A-Za-z0-9!@#$%.,?^&*]{8,20}$'
            value={values.password}
            onChange={handleInputChange}
          />
          <FormInput
            errMes='Please let Passwords match'
            // label='Password'
            type='password'
            placeholder='Confirm Passwoed'
            name='confirmPassword'
            required={true}
            pattern={values.password}
            value={values.confirmPassword}
            onChange={handleInputChange}
          />
          <div className='radioContainer'>
            {genderItems.map((item) => (
              <Radio
                key={item.id}
                label={item.title}
                id={item.id}
                name='gender'
                value={values.gender}
                onChange={handleInputChange}
              />
            ))}
          </div>
          <button className={isloading && "opacity"}>
            {" "}
            {isloading && <LoadingBox />}Submit
          </button>
          <p className='link'>
            Already Registered?{" "}
            <Link className='link' to={"/loginpage"}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
