import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layout/user/userLayout";
import AdminLayout from "./layout/Admin/AdminLayout";
import Register from "./layout/user/Logup/Logup";
import Login from "./layout/user/Login/Login";
import ForgotPassword from "./layout/user/ForgotPassword/ForgotPassword";
import ResetPassword from "./layout/user/ForgotPassword/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>          
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/admin/*' element={<AdminLayout />} />        
        <Route path="/*" element={<UserLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
