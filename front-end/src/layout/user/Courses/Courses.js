import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Spin } from "antd";
// import "./Courses.css";
import CourseDetailModal from "../CourseDetailModal/CourseDetailModal";

function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [languages, setLanguages] = useState([]);
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
      setLanguages(languages);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khóa học:", error);
    } finally {
      setSpinning(false);
    }
  };
  const getRandomColor = () => {
  const darkColors = [
    "#1F2937", // xanh đen
  "#B91C1C", // đỏ đậm
  "#C2410C", // cam nâu
  "#1E3A8A", // xanh navy
  "#6B21A8", // tím đậm
  "#14532D", // xanh lá đậm
  "#0F172A", // xanh xám đậm
  "#4B5563", // xám đậm
  "#3F3F46", // ghi than
  "#7C3AED", // tím sáng
  ];
  return darkColors[Math.floor(Math.random() * darkColors.length)];
};


  const languageColors = useMemo(() => {
  const colors = {};
  languages.forEach(lang => {
    colors[lang._id] = getRandomColor();
  });
  return colors;
}, [languages]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="allcourses-page">
      <Spin spinning={spinning} fullscreen />

      {languages.map((lang) => {
        const coursesInLang = featuredCourses.filter(course => course.language?._id === lang._id);
        if (coursesInLang.length === 0) return null;

        return (
          <div className="language-group" key={lang._id}>
            <h2>KHÓA HỌC {lang.language.toUpperCase()}</h2>
            <div className="course-list">
          {coursesInLang.map((course) => (
            <div className="course-card" key={course._id}>
              <div className="top-half" style={{ backgroundColor: languageColors[lang._id]}}>
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
                  <button className="sign-up-course">Đăng ký</button>
                </div>
              </div>
            </div>
          ))}
        </div>
          </div>
        );
      })}

      {/* Modal */}
      <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}

export default Courses;
