import { Link } from "react-router-dom";
import banner from "../../../imgs/banner.png";
import banner2 from "../../../imgs/banner2.png";
import banner3 from "../../../imgs/banner3.png";
import "./Home.css";
import { Spin, Carousel } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

import CourseDetailModal from "../CourseDetailModal/CourseDetailModal";

import { course } from "../../../mockdatahome"; // Import dữ liệu giả

function Home() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [featuredTeachers, setFeaturedTeachers] = useState([]);
  const [spinning, setSpinning] = useState(false);

  // const fetchData = async () => {
  //     setSpinning(true);
  //     try {
  //         const [coursesResponse, teachersResponse] = await Promise.all([
  //             axios.get(`http://localhost:3005/api/courses`, { withCredentials: true }),
  //             axios.get(`http://localhost:3005/api/teachers`, { withCredentials: true }),
  //         ]);

  //         setFeaturedCourses(coursesResponse.data);
  //         setFeaturedTeachers(teachersResponse.data);
  //     } catch (error) {
  //         console.error(error);
  //     } finally {
  //         setSpinning(false);
  //     }
  // };

  // useEffect(() => {
  //     fetchData();
  // }, []);
  useEffect(() => {
    setSpinning(true);
    setFeaturedCourses(course);
    setSpinning(false);
  }, []);

  return (
    <div className="homepage">
      <Spin spinning={spinning} fullscreen />
      <Carousel autoplay autoplaySpeed={3000}>
        <div className="homepage-banner">
          <img src={banner} alt="Banner 1" />
        </div>
        <div className="homepage-banner">
          <img src={banner2} alt="Banner 2" />
        </div>
        <div className="homepage-banner">
          <img src={banner3} alt="Banner 3" />
        </div>
      </Carousel>

      {/* Khóa học nổi bật */}
      <section className="homepage-section">
        <div className="section-header">
          <span>Khóa học nổi bật</span>
          <Link to="/courses">
            <span>Xem tất cả</span>
            <ion-icon name="arrow-forward"></ion-icon>
          </Link>
        </div>

        <div className="course-list">
          {featuredCourses.slice(0, 4).map((course) => (
            <div className="course-card" key={course.id}>
              <div className="top-half">
                <div className="language">
                  KHÓA HỌC {course.language?.toUpperCase()}
                </div>
                <div className="level">
                  TRÌNH ĐỘ {course.level?.toUpperCase()}
                </div>
              </div>

              <div className="bottom-half">
                <div className="course-description">
                  <div>
                    <ion-icon name="caret-forward-outline"></ion-icon> Ngày bắt
                    đầu: {course.startDate}
                  </div>
                  <div>
                    <ion-icon name="calendar"></ion-icon> Lịch học:{" "}
                    {course.schedule}
                  </div>
                  <div>
                    <ion-icon name="pie-chart"></ion-icon> Số tiết:{" "}
                    {course.lessons}
                  </div>
                  <div>
                    <ion-icon name="person"></ion-icon> Giảng viên:{" "}
                    {course.teacher}
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="properties-course" onClick={() => setSelectedCourse(course)}>Chi tiết</button>
                  <button className="sign-up-course">Đăng ký</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*Xử lí nút xem chi tiết */}
        <CourseDetailModal 
        course={selectedCourse} 
        onClose={() => setSelectedCourse(null)} 
        />
      </section>
    </div>
  );
}

export default Home;
