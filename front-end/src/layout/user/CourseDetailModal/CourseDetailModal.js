import React from "react";
import "./CourseDetailModal.css";

const CourseDetailModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Thông tin khóa học</h2>
        <p><strong>Ngôn ngữ:</strong> {course.language}</p>
        <p><strong>Trình độ:</strong> {course.level}</p>
        <p><strong>Ngày bắt đầu:</strong> {course.startDate}</p>
        <p><strong>Lịch học:</strong> {course.schedule}</p>
        <p><strong>Số tiết:</strong> {course.lessons}</p>
        <p><strong>Giảng viên:</strong> {course.teacher}</p>
        <p><strong>Mô tả:</strong> {course.description}</p>
        <p><strong>Học phí:</strong> {course.fee} VND</p>
        <button className="close-button" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default CourseDetailModal;
