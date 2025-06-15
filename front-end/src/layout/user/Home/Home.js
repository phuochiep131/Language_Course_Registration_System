import { Link } from "react-router-dom";
import banner from "../../../imgs/banner.png";
import banner2 from "../../../imgs/banner2.png";
import banner3 from "../../../imgs/banner3.png";
import "./Home.css";
import { Spin, Carousel } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import CourseDetailModal from "../CourseDetailModal/CourseDetailModal";

function Home() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [spinning, setSpinning] = useState(false);

  const fetchData = async () => {
    setSpinning(true);
    try {
      const [courseRes, langRes, levelRes, teacherRes] = await Promise.all([
        axios.get("http://localhost:3005/api/course", { withCredentials: true }),
        axios.get("http://localhost:3005/api/language", { withCredentials: true }),
        axios.get("http://localhost:3005/api/languagelevel", { withCredentials: true }),
        axios.get("http://localhost:3005/api/teacher", { withCredentials: true }),
      ]);

      const courses = courseRes.data;
      const languages = langRes.data;
      const levels = levelRes.data;
      const teachers = teacherRes.data;

      const enrichedCourses = courses.map((course) => ({
        ...course,
        language: languages.find((l) => l._id === course.language_id),
        level: levels.find((lv) => lv._id === course.languagelevel_id),
        teacher: teachers.find((t) => t._id === course.teacher_id),
      }));

      setFeaturedCourses(enrichedCourses);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khóa học:", error);
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    fetchData();
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
            <div className="course-card" key={course._id}>
              <div className="top-half">
                <div className="language">
                  KHÓA HỌC {course.language?.language?.toUpperCase() || "CHƯA RÕ"}
                </div>
                <div className="level">
                  TRÌNH ĐỘ {course.level?.language_level?.toUpperCase() || "CHƯA RÕ"}
                </div>
              </div>

              <div className="bottom-half">
                <div className="course-description">
                  <div>
                    <ion-icon name="caret-forward-outline"></ion-icon> Ngày bắt đầu:{" "}
                    {new Date(course.Start_Date).toLocaleDateString("vi-VN")}
                  </div>
                  <div>
                    <ion-icon name="pie-chart"></ion-icon> Số tiết:{" "}
                    {course.Number_of_periods}
                  </div>
                  <div>
                    <ion-icon name="cash"></ion-icon> Học phí:{" "}
                    {course.Tuition?.toLocaleString()} đ
                  </div>
                  <div>
                    <ion-icon name="person"></ion-icon> Giảng viên:{" "}
                    {course.teacher?.full_name || "Đang cập nhật"}
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="properties-course" onClick={() => setSelectedCourse(course)}>
                    Chi tiết
                  </button>
                  {/* <button className="sign-up-course">Đăng ký</button> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal chi tiết */}
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      </section>
    </div>
  );
}

export default Home;
