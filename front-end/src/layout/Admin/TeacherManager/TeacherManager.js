import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Flex,
  Breadcrumb,
  Badge,
  Modal,
  Form,
  Input,
  Upload,
  Spin,
  Select,
  Image,
} from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { SmileOutlined, MailOutlined } from "@ant-design/icons";

function TeacherManager() {
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [fileList, setFileList] = useState([]);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      render: (record) => (
        <Flex align="center" gap={10}>
          <Image src={record.avatar} width={40} style={{ borderRadius: 30 }} />
          <h4 style={{ fontWeight: 600 }}>{record.full_name}</h4>
        </Flex>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 350,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (gender) => (
        <Badge
          color={gender === "Nam" ? "#1890ff" : "#f759ab"}
          count={gender}
        />
      ),
      filters: [
        { text: "Nam", value: "Nam" },
        { text: "Nữ", value: "Nữ" },
      ],
      onFilter: (value, record) => record.gender === value,
      width: 150,
    },
    {
      title: "Ngôn ngữ",
      dataIndex: "language_id",
      render: (langId) => {
        const lang = languages.find((l) => l._id === langId);
        return lang ? lang.language : langId;
      },
      filters: languages.map((lang) => ({
        text: lang.language,
        value: lang._id,
      })),
      onFilter: (value, record) => record.language_id === value,
    },
    // {
    //     title: 'Ngôn ngữ',
    //     dataIndex: 'language_name', // sẽ map thủ công khi fetch
    // },
    {
      title: "Sửa",
      dataIndex: "update",
      render: (_id) => <Link to={`update/${_id}`}>Sửa</Link>,
      width: 60,
      align: "center",
    },
  ];

  const onChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onSelectChange = (newSelectedRowKeys) =>
    setSelectedRowKeys(newSelectedRowKeys);

  const showModal = () => setOpen(true);

  const showDeleteConfirm = () => setOpenDeleteConfirm(true);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onFinish = async (values) => {
    setSpinning(true);
    setOpen(false);

    console.log(values);

    const createTeacher = (avatarUrl = null) => {
      const newTeacher = {
        full_name: values.full_name,
        gender: values.gender,
        email: values.email,
        language_id: values.language,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      axios
        .post(`http://localhost:3005/api/teacher`, newTeacher, {
          withCredentials: true,
        })

        .then(() => {
          fetchData();
          setFileList([]);
        })
        .catch((error) => console.error("Error creating teacher:", error))
        .finally(() => setSpinning(false));
    };

    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const maxImageSize = 1024;

      try {
        let compressedFile = file;
        if (file.size > maxImageSize) {
          compressedFile = await imageCompression(file, {
            maxSizeMB: 0.8,
            maxWidthOrHeight: maxImageSize,
            useWebWorker: true,
          });
        }

        const storageRef = ref(storage, `teachers/${compressedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              createTeacher(downloadURL);
            });
          }
        );
      } catch (error) {
        console.error("Image Compression Error:", error);
      }
    } else {
      createTeacher();
    }
  };

  const handleDelete = () => {
    setSpinning(true);
    setOpenDeleteConfirm(false);

    axios
      .delete(`http://localhost:3005/api/teacher/multiple`, {
        data: { teacherIds: selectedRowKeys },
        withCredentials: true,
      })
      .then(() => {
        fetchData();
        setSelectedRowKeys([]);
      })
      .catch((error) => console.log(error))
      .finally(() => setSpinning(false));
  };

  const fetchLanguages = () => {
    axios
      .get(`http://localhost:3005/api/language`, {
        withCredentials: true,
      })
      .then((res) => {
        setLanguages(res.data);
      })
      .catch((err) => console.log("Error fetching languages:", err));
  };

  const fetchData = () => {
    axios
      .get(`http://localhost:3005/api/teacher`, {
        withCredentials: true,
      })
      .then((response) => {
        const dataFormatted = response.data.map((t) => ({
          key: t._id,
          full_name: { full_name: t.full_name, avatar: t.avatar },
          gender: t.gender,
          email: t.email,
          language_id: t.language_id?._id,
          language_name: t.language_id?.language || "",
          update: t._id,
        }));
        setTeachers(dataFormatted);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (languages.length > 0) {
      fetchData();
    }
  }, [languages]);

  return (
    <Flex
      className="TeacherManager"
      vertical
      gap={20}
      style={{ position: "relative" }}
    >
      <Spin spinning={spinning} fullscreen />
      <Breadcrumb
        items={[{ title: "Admin Dashboard" }, { title: "Quản lý giảng viên" }]}
      />
      <Flex>
        <Button type="primary" onClick={showModal}>
          Thêm giảng viên
        </Button>
      </Flex>
      {selectedRowKeys.length > 0 && (
        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: "10px 15px",
            borderRadius: "5px",
            backgroundColor: "white",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.15)",
            position: "sticky",
            top: "10px",
            zIndex: 10,
          }}
        >
          <span>Đã chọn {selectedRowKeys.length} giảng viên</span>
          <Button type="primary" danger onClick={showDeleteConfirm}>
            Xoá
          </Button>
        </Flex>
      )}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={teachers}
        bordered
      />
      <Modal
        open={openDeleteConfirm}
        title="Xác nhận xoá"
        onCancel={() => setOpenDeleteConfirm(false)}
        footer={[
          <Button key="back" onClick={() => setOpenDeleteConfirm(false)}>
            Quay lại
          </Button>,
          <Button key="submit" type="primary" danger onClick={handleDelete}>
            Xoá
          </Button>,
        ]}
        centered
      >
        <p>
          {selectedRowKeys.length} giảng viên sẽ bị xoá vĩnh viễn. Bạn có chắc
          không?
        </p>
      </Modal>
      <Modal
        open={open}
        title="Thêm giảng viên mới"
        onCancel={() => setOpen(false)}
        footer={[]}
        width={400}
        centered
      >
        <Form
          name="teacher_form"
          onFinish={onFinish}
          initialValues={{ gender: "Nam" }}
        >
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input
              prefix={<SmileOutlined />}
              placeholder="Họ và tên"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" allowClear />
          </Form.Item>
          <Form.Item
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Giới tính">
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="language"
            rules={[{ required: true, message: "Vui lòng chọn ngôn ngữ!" }]}
          >
            <Select placeholder="Ngôn ngữ giảng dạy">
              {languages.map((lang) => (
                <Select.Option key={lang._id} value={lang._id}>
                  {lang.language}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="avatar">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              maxCount={1}
            >
              Upload
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Tạo giảng viên
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
}

export default TeacherManager;
