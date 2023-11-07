import { UseForm } from "../../components/useForm";
import FormInput from "../../components/FormInput";
import Radio from "../../components/Radio";
import { toast } from "react-toastify";
import { useContext } from "react";
import { Store } from "../../store";
import axios from "axios";
import { getError } from "../../components/getError";
import "./EditUser.css";
import { ArrowBack } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
const EditUser = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const url = process.env.REACT_APP_SERVER_URL;
  const { userInfo } = state;
  const initialValues = {
    username: userInfo.username,
    email: userInfo.email,
    birthday: userInfo.birthday,
    password: userInfo.password,
    confirmPassword: userInfo.password,
    from: userInfo.from,
    relationship: userInfo.relationship,
    city: userInfo.city,
    gender: userInfo.gender,
    phone: userInfo.phone,
    school: userInfo.school,
  };
  const genderItems = [
    { id: "male", title: "Male" },
    { id: "female", title: "Female" },
    { id: "other", title: "Other" },
  ];
  const relationship = [
    { id: "single", title: "Single" },
    { id: "married", title: "Married" },
    { id: "engage", title: "Engage" },
  ];
  const { values, handleInputChange } = UseForm(initialValues);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.put(
        `${url}/users/${userInfo._id}/update`,
        values
      );
      localStorage.removeItem("userInfo");
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Successfully Updated Your Profile!");
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <div>
      <div className='upperContainer'>
        <ArrowBack fontSize='large' onClick={() => navigate("/")} />
      </div>
      <div className='editContaiainer'>
        <div className='wrapper sections'>
          <form className='form-control' onSubmit={handleSubmit}>
            {" "}
            <h1>Edit Page</h1>
            <FormInput
              errMes='Username should be 3-16 characters and must not include any special character!'
              label='Username'
              type='text'
              placeholder='Username'
              name='username'
              pattern='^[A-Za-z0-9]{3,16}$'
              value={values.username}
              onChange={handleInputChange}
            />
            <FormInput
              errMes='This email is not valid'
              label='Email'
              type='email'
              placeholder='Email'
              name='email'
              value={values.email}
              onChange={handleInputChange}
            />
            <FormInput
              label='Birthday'
              type='date'
              placeholder='Birthday'
              name='birthday'
              value={values.birthday}
              onChange={handleInputChange}
            />
            <FormInput
              label='From '
              type='text'
              placeholder='You Are From Where'
              name='from'
              value={values.from}
              onChange={handleInputChange}
            />
            <FormInput
              label='Current City'
              type='text'
              placeholder='Your Current City'
              name='city'
              value={values.city}
              onChange={handleInputChange}
            />
            <FormInput
              label='Phone No'
              type='text'
              placeholder='Your Number'
              name='phone'
              value={values.phonr}
              onChange={handleInputChange}
            />
            <FormInput
              label='Your School'
              type='text'
              placeholder='Last school you attended'
              name='school'
              value={values.school}
              onChange={handleInputChange}
            />
            <div className='radioContainer'>
              {relationship.map((item) => (
                <Radio
                  key={item.id}
                  label={item.title}
                  id={item.id}
                  name='relationship'
                  value={values.relationship}
                  onChange={handleInputChange}
                />
              ))}
            </div>
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
            <button>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
