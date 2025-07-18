import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
// import LeftNav from "../../components/LeftNav/LeftNav";
import Home from "./Home/Home";
import Courses from "./Courses/Courses";
import RegisteredCourses from "./Registered-Courses/RegisteredCourses";
import UserAcc from "./UserAccount/UserAccount";

import "./userLayout.css";

function UserLayout() {
    const userContentRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (userContentRef.current) {
            userContentRef.current.scrollTop = 0;
        }
    }, [location]);

    return (
        <div className="UserLayout">
            {/* <div className="User-content-top">
                <Header />
            </div> */}
            <div className="User-content" ref={userContentRef}>
            <div className="User-content-top">
                <Header />
            </div>
                {/* <div className="User-content-top">
                    <Header /> */}
                    <div className="content-fill">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/user/account/:id" element={<UserAcc />} />
                            <Route path="/my-courses/:id" element={<RegisteredCourses />} />                                                        
                        </Routes>
                    </div>
                {/* </div> */}
                <Footer />
            </div>
        </div>

    )
}


export default UserLayout;
