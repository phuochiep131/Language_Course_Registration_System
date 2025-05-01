// AdminLayout.js
import { useEffect, useState } from 'react';
import {
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    CalendarOutlined,
    PieChartOutlined,
    ExportOutlined
} from '@ant-design/icons';
import { Flex, Layout, Menu } from 'antd';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Các component giả định
// import Overview from './Overview';
import UserManager from './UserManager/UserManager';
import UpdateUser from './UserManager/UpdateUser';
// import CourseManager from './CourseManager/CourseManager';
// import TeacherManager from './TeacherManager/TeacherManager';
// import ScheduleManager from './ScheduleManager/ScheduleManager';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem(<Link to="/admin">Tổng quan</Link>, 'overview', <PieChartOutlined />),
    getItem(<Link to="/admin/users">Quản lý người dùng</Link>, 'users', <UserOutlined />),
    getItem(<Link to="/admin/courses">Quản lý khóa học</Link>, 'courses', <BookOutlined />),
    getItem(<Link to="/admin/teachers">Quản lý giảng viên</Link>, 'teachers', <TeamOutlined />),
    getItem(<Link to="/admin/schedules">Quản lý lịch học</Link>, 'schedules', <CalendarOutlined />),
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const activeTab =
        location.pathname.startsWith('/admin/users') ? 'users' :
        location.pathname.startsWith('/admin/courses') ? 'courses' :
        location.pathname.startsWith('/admin/teachers') ? 'teachers' :
        location.pathname.startsWith('/admin/schedules') ? 'schedules' :
        'overview';

    const [collapsed, setCollapsed] = useState(false);
    const [currentUser, setCurrentUser] = useState();

    // const fetchUserData = () => {
    //     axios.get(`http://localhost:3005/api/users/info`, { withCredentials: true })
    //         .then(response => {
    //             if (response.data.role !== "Admin") {
    //                 navigate('/');
    //             }
    //             setCurrentUser(response.data);
    //         })
    //         .catch(() => navigate('/'));
    // }

    // useEffect(() => {
    //     fetchUserData();
    // }, []);
    useEffect(() => {
        // Tạm set user là admin để test
        setCurrentUser({ role: "Admin", name: "Test Admin" });
    }, []);
    

    return (
        <div>
            {currentUser &&
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={260}>
                        <Flex className="demo-logo-vertical" style={{ color: "white", padding: "20px" }} justify={!collapsed ? "space-between" : "center"}>
                            {!collapsed && <h2>DREAM ADMIN</h2>}
                            <Link to="/" target="_blank"><ExportOutlined style={{ color: "white" }} /></Link>
                        </Flex>
                        <Menu theme="dark" defaultSelectedKeys={[activeTab]} mode="inline" items={items} />
                    </Sider>
                    <Layout style={{ padding: "20px 30px", height: "100vh", overflowY: "auto" }}>
                        <Routes>
                            {/* <Route path="/" element={<Overview />} /> */}
                            <Route path="users" element={<UserManager />} />
                            <Route path="users/update/:id" element={<UpdateUser />} />
                            {/* <Route path="courses" element={<CourseManager />} /> */}
                            {/* <Route path="teachers" element={<TeacherManager />} /> */}
                            {/* <Route path="schedules" element={<ScheduleManager />} /> */}
                        </Routes>
                    </Layout>
                </Layout>
            }
        </div>
    );
};

export default AdminLayout;
