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

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const newPost = {
      userId: INFO?._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axios.post(`${url}/upload`, data);
      } catch (err) {
        window.alert(err);
      } finally {
        setLoading(false);
      }
    }
    try {
      setLoading(true);
      await axios.post(`${url}/posts`, newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const ProfileImg = async (e) => {
    setLoading(true);
    const IMG = {
      userId: INFO?._id,
    };
    if (img) {
      const data = new FormData();
      const fileName = Date.now() + img.name;
      data.append("name", fileName);
      data.append("file", img);
      IMG.profilePicture = fileName;
      try {
        await axios.post(`${url}/upload`, data);
      } catch (err) {
        window.alert(err);
      } finally {
        setLoading(false);
      }
    }
    try {
      const { data } = await axios.put(`${url}/users/${INFO._id}/update`, IMG);
      localStorage.removeItem("userInfo");
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(INFO);
      window.location.reload();
    } catch (err) {}
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
                    ? PF + INFO?.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=''
              />
              <input
                style={{ display: "none" }}
                type='file'
                id='fi'
                accept='.png,.jpeg,.jpg'
                onChange={(e) => setImg(e.target.files[0])}
              />
            </label>
            {/* <button onClick={newImg}>DONE</button> */}
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
              accept='.png,.jpeg,.jpg'
              onChange={(e) => setFile(e.target.files[0])}
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
            <img className='shareImg' src={URL.createObjectURL(img)} alt='' />
            <Cancel className='shareCancelImg' onClick={() => setImg(null)} />
            <button className={loading && "opacity"} onClick={ProfileImg}>
              {loading ? <LoadingBox /> : "Update"}
            </button>
          </div>
        )}
      </div>
      <div>
        {file && (
          <div className='shareImgContainer'>
            <img className='shareImg' src={URL.createObjectURL(file)} alt='' />
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
            <button className={loading && "opacity"} onClick={submitHandler}>
              {" "}
              {loading ? <LoadingBox /> : "Post"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
