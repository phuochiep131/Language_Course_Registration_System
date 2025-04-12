import { useEffect, useState, useRef } from "react";
import "./Header.css";

import logo from "../../imgs/logo.png";
import avt from "../../imgs/avt.jpg";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [popupDisplay, setPopupDisplay] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });
  const popupRef = useRef(null);
  const avatarRef = useRef(null);

  const fetchUserData = () => {
    axios
      .get(`http://localhost:3005/api/users/info`, { withCredentials: true })
      .then((response) => {
        setCurrentUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    axios
      .get(`http://localhost:3005/api/auth/logout`, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const handleLogout = () => {
  //     axios.get(`http://localhost:3005/api/auth/logout`, { withCredentials: true })
  //         .then(() => {
  //             localStorage.removeItem("currentUser");
  //             setCurrentUser(null);
  //             setPopupDisplay(false); // Tắt popup
  //             navigate("/"); // điều hướng về trang chủ
  //         })
  //         .catch(error => {
  //             console.log(error);
  //         });
  // };

  const handleFakeLogin = () => {
    const fakeUser = {
      name: "Nguyễn Duy Tín",
      avatar: avt,
      role: "Admin",
    };
    localStorage.setItem("currentUser", JSON.stringify(fakeUser));
    setCurrentUser(fakeUser);
  };

  const handleFakeLogout = () => {
    localStorage.removeItem("currentUser");
    setPopupDisplay(false); // Tắt popup
    navigate("/"); // điều hướng về trang chủ
    setCurrentUser(null);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setPopupDisplay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            ref={avatarRef}
          />
          {popupDisplay && (
            <>
              <div
                className="overlay"
                onClick={() => setPopupDisplay(!popupDisplay)}
              ></div>
              <div className="Header_avatar_popup" ref={popupRef}>
                <div className="avatar_popup_name">
                  <img src={currentUser.avatar} alt="" />
                  <div>
                    <h2>{currentUser.name}</h2>
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
                <div className="avatar_popup_option" onClick={handleFakeLogout}>
                  <a>
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
            /*onClick={handleFakeLogin}*/ onClick={() => navigate("/login")}
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
