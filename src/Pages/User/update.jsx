import React, { useState, useRef, useContext } from "react";
import "./update.css";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Button } from "../../Components/Button/Button";
import axios from "axios";
import { GlobalState } from "../../GlobalState";

const Update = ({ setOpenUpdate, user }) => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const handleFileClick = (ref) => {
    ref.current.click();
  };
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar);

  
  const handleUpload = async (e, imageType) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) return alert("File not exist");
      if (file.size > 1024 * 1024) return alert("Size too large");
      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("File format is incorrect");
      
      const formData = new FormData();
      formData.append("file", file);
      
      setLoading(true);
      
      if (token) {
        const res = await axios.post("/api/upload", formData, {
          headers: { "content-type": "multipart/form-data", Authorization: token },
        });
        setLoading(false);
        if (imageType === "cover") {
          setCover(res.data.result.secure_url);
        } else {
          setAvatar(res.data.result);
        }
      }
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestory = async () => {
    try {
      setLoading(true);
      await axios.post("/api/destroy", { public_id: avatar.public_id });
      setLoading(false);
      setAvatar("");
      history.push("/profile");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChange = (e) => {
    // setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
    
  const handleSubmit = async (e) => {
    console.log("clicks");
    console.log("submit profile", ...profile, avatar);
    e.preventDefault();
    try {
      console.log("submit profile", ...profile, avatar);
      if (!avatar || !cover) return alert("No Image Upload")
      await axios.put(`/api/user/${user._id}`, { ...profile, avatar, cover })
      setOpenUpdate(false);
      setCover(null);
      setProfile(null);
    } catch (err) {
      console.log("error");
      console.log(err);
      alert(err);
    }
  };

    console.log("user", profile, cover, avatar);

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imageContainer">
                <img
                  src={
                    cover
                      ? cover
                      : "https://i.imgur.com/FeSecjq.jpg"
                  }
                  alt=""
                />
                <div className="file-input-container">
                  <input
                    type="file"
                    id="cover"
                    ref={coverInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "cover")}
                  />
                  <Button
                    primary
                    label="Upload File"
                    icon={<IoCloudUploadOutline className="upload-icon" />}
                    onClick={() => handleFileClick(coverInputRef)}
                  />
                </div>
              </div>
            </label>
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imageContainer">
                <img
                  src={
                    avatar
                      ? user.avatar
                      : "https://i.imgur.com/i8HErCE.png"
                  }
                  alt=""
                />
                <div className="file-input-container">
                  <input
                    type="file"
                    id="profile"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "avatar")}
                  />
                  <Button
                    primary
                    label="Upload File"
                    icon={<IoCloudUploadOutline className="upload-icon" />}
                    onClick={() => handleFileClick(fileInputRef)}
                  />
                </div>
              </div>
            </label>
          </div>
          <label>Email</label>
          <input
            type="text"
            value={profile.email}
            name="email"
            placeholder={user.email ? user.email : "demo@demo.com"}
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={profile.password}
            name="password"
            placeholder="********"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={profile.name}
            name="name"
            // placeholder={user.name ? user.name : "Demo User"}
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={profile.city}
            placeholder={user.city ? user.city : "Houston, TX"}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={profile.website}
            placeholder={user.website ? user.website : "www.hoseacodes.com"}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
