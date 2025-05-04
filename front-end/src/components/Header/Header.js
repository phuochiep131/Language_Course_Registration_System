import { useEffect, useState } from "react";
import "./Header.css";

import logo from "../../imgs/logo.png";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [popupDisplay, setPopupDisplay] = useState(false);

  const [currentUser, setCurrentUser] = useState()

  const fecthUserData = () => {
    axios.get(`http://localhost:3005/api/user/info`, {
        withCredentials: true
    })
        .then(response => {
            console.log(response.data);
            setCurrentUser(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

  const handleLogout = () => {
    axios.get(`http://localhost:3005/api/auth/logout`, {
        withCredentials: true
    })
        .then(response => {
            console.log(response.data);
            window.location.reload();
        })
        .catch(error => {
            // console.log(error);
        });
}

const handleLoginClick = () => {

  const stateData = {
      action: "redirect",
      url: location.pathname
  };

  navigate('/login', { state: stateData });
}

  useEffect(() => {
    fecthUserData();
  }, []);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="Header">
      {/* Logo */}
      <div className="Header_logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Thanh điều hướng */}
      <div className="Header_nav">
        <Link
          className={`Header_nav_item ${isActive("/") ? "active" : ""}`}
          to="/"
        >
          <ion-icon name="home"></ion-icon>
          <span>Trang chủ</span>
        </Link>

        <Link
          className={`Header_nav_item ${isActive("/courses") ? "active" : ""}`}
          to="/courses"
        >
          <ion-icon name="book"></ion-icon>
          <span>Khóa học</span>
        </Link>

        <Link
          className={`Header_nav_item ${
            isActive("/my-courses") ? "active" : ""
          }`}
          to="/my-courses"
        >
          <ion-icon name="school"></ion-icon>
          <span>Khóa học của tôi</span>
        </Link>
      </div>

      {/* Tài khoản */}
      {currentUser ? (
        <div className="Header_avatar">
          <img
            src={currentUser.avatar}
            alt=""
            onClick={() => setPopupDisplay(!popupDisplay)}
          />
          {popupDisplay && (
            <>
              <div
                className="overlay"
                onClick={() => setPopupDisplay(!popupDisplay)}
              ></div>
              <div className="Header_avatar_popup">
                <div className="avatar_popup_name">
                  <img src={currentUser.avatar} alt="" />
                  <div>
                    <h2>{currentUser.fullname}</h2>
                    <span
                      className={
                        currentUser.role === "Admin" ? "badge-admin" : ""
                      }
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                {currentUser.role === "Admin" && (
                  <a href="/admin">
                    <ion-icon name="settings-outline"></ion-icon>
                    <span>Admin Dashboard</span>
                  </a>
                )}
                <a href="/">
                  <ion-icon name="person-circle-outline"></ion-icon>
                  <span>Tài khoản</span>
                </a>
                <div className="avatar_popup_option" onClick={() => handleLogout()}>
                  <a href="/">
                    <ion-icon name="log-out-outline"></ion-icon>
                    <span>Đăng xuất</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="Header_auth_buttons">
          <button
            className="Login_button"
            onClick={() => handleLoginClick()}
          >
            Đăng nhập
          </button>
          <button
            className="Register_button"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
