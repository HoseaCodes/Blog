import React, { useState, useContext } from "react";
import Update from "./update";
import "./profile1.css";
import { GlobalState } from "../../GlobalState";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaGlobe,
} from "react-icons/fa";
import { IoMdMore, IoIosMail } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { Button } from "../../Components/Button/Button";
import Projects from "./projects";
import Skills from "./skills";

const Profile = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [openUpdate, setOpenUpdate] = useState(false);

  return (
    <div className="profile">
      <div className="images">
        <img
          src={
            user.cover
              ? user.cover
              : "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt=""
          className="cover"
        />
        <img
          src={
            user.avatar
              ? user.avatar
              : "https://images.unsplash.com/photo-1519689373023-dd07c7988603?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FaFacebook />
            </a>
            <a href="http://instagram.com">
              <FaInstagram />
            </a>
            <a href="http://twitter.com">
              <FaTwitter />
            </a>
            <a href="http://linkedin.com">
              <FaLinkedin />
            </a>
            <a href="http://pinterest.com">
              <FaPinterest />
            </a>
          </div>
          <div className="center">
            <span>{user.name ? user.name : "Demo User"}</span>
            <div className="info">
              <div className="item">
                <IoLocationOutline />
                <span>{user.city ? user.city : "Houston, TX"}</span>
              </div>
              <div className="item">
                <FaGlobe />
                <span>
                  {user.website ? user.website : "www.hoseacodes.com"}
                </span>
              </div>
            </div>
            <Button
              primary
              label="Update Profile"
              onClick={() => setOpenUpdate(true)}
            />
          </div>
          <div className="right">
            <IoIosMail />
            <IoMdMore />
          </div>
        </div>
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
      {/* <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px 70px",
        width: "100%",
        flexWrap: "wrap"
      }}>
        <Skills />
        <Projects />
      </div> */}
    </div>
  );
};

export default Profile;
