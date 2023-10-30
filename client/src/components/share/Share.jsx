import "./share.css";
import { PermMedia, Cancel } from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import { Store } from "../../store";
import LoadingBox from "../LoadingBox";
// import { toast }  "react-toastify";

export default function Share() {
  const { state } = useContext(Store);
  const { userInfo: INFO } = state;

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const url = process.env.REACT_APP_SERVER_URL;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileimg = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImg(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePostImg = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const newPost = {
      userId: INFO?._id,
      desc: desc.current.value,
      img: file,
    };
    // if (file) {
    //   const data = new FormData();
    //   const fileName = Date.now() + file.name;
    //   data.append("name", fileName);
    //   data.append("file", file);
    //   newPost.img = fileName;
    //   try {
    //     await axios.post(`${url}/upload`, data);
    //   } catch (err) {
    //     window.alert(err);
    //   }
    // }
    try {
      await axios.post(`${url}/posts`, newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };
  const ProfileImg = async (e) => {
    if (!img) return;
    setLoading(true);
    const IMG = {
      userId: INFO?._id,
      profilePicture: img,
    };
    try {
      console.log("data");
      const { data } = await axios.put(`${url}/users/${INFO._id}/update`, IMG);
      localStorage.removeItem("userInfo");
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setImg(null);
    }
  };

  return (
    <div className='share'>
      <div className='shareWrapper'>
        <div className='shareTop'>
          <div>
            {" "}
            <label htmlFor='fi'>
              <img
                id='img'
                className='shareProfileImg'
                src={
                  INFO?.profilePicture
                    ? INFO?.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt='profilePicture'
              />
              <input
                style={{ display: "none" }}
                type='file'
                id='fi'
                onChange={handleProfileimg}
              />
            </label>
          </div>
          <input
            placeholder={"What's in your mind " + INFO?.username + "?"}
            className='shareInput'
            ref={desc}
          />
        </div>

        <div className='shareOptions'>
          <label htmlFor='file' className='shareOption'>
            <PermMedia htmlColor='tomato' className='shareIcon' />
            <span className='shareOptionText'>Post Here</span>
            <input
              style={{ display: "none" }}
              type='file'
              id='file'
              onChange={handlePostImg}
            />
          </label>
        </div>
        {/* <button className='shareButton' type='submit'>
            Share
          </button> */}
      </div>
      <div>
        {img && (
          <div className='shareImgContainer'>
            {/* <img src={URL.createObjectURL(img)} alt='' /> */}
            {img && <img className='shareImg' src={img} alt='Uploaded File' />}
            <Cancel className='shareCancelImg' onClick={() => setImg(null)} />
            <button onClick={ProfileImg}>
              {loading ? <LoadingBox /> : "Update"}{" "}
            </button>
          </div>
        )}
      </div>
      <div>
        {file && (
          <div className='shareImgContainer'>
            {file && <img className='shareImg' src={file} alt='Post img' />}
            <Cancel
              className='shareCancelImg'
              fontSize='large'
              onClick={() => setFile(null)}
            />
            <input
              placeholder={"Write Something about this image!"}
              className='shareInput'
              ref={desc}
            />
            <button onClick={submitHandler}>
              {" "}
              {loading ? <LoadingBox /> : "Post"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
