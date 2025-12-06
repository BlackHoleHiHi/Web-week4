import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  // State cho form thêm mới
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studentClass, setStudentClass] = useState("");

  // 1. Lấy danh sách học sinh khi vừa vào trang
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error("Lỗi tải danh sách:", err));
  }, []);
  // [cite: 73-82]

  // 2. Xử lý khi bấm nút "Thêm"
  const handleAddStudent = (e) => {
    e.preventDefault(); // Ngăn load lại trang
    
    const newData = {
      name: name,
      age: Number(age), // Chuyển đổi sang số để Backend không báo lỗi
      class: studentClass
    };

    axios.post('http://localhost:5000/api/students', newData)
      .then(res => {
        // Thêm thành công -> Cập nhật ngay vào bảng bên dưới
        setStudents([...students, res.data]);
        
        // Xóa trắng form để nhập người tiếp theo
        setName("");
        setAge("");
        setStudentClass("");
        alert("Đã thêm thành công!");
      })
      .catch(err => {
        // Hiển thị lỗi chi tiết nếu có
        console.error(err);
        const message = err.response && err.response.data && err.response.data.error 
          ? err.response.data.error 
          : err.message;
        alert("Lỗi khi thêm: " + message);
      });
  };
  // [cite: 124-136]

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Quản Lý Học Sinh</h1>

      {/* --- FORM THÊM HỌC SINH --- */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h3>Thêm Học Sinh Mới</h3>
        <form onSubmit={handleAddStudent} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input 
            type="text" placeholder="Họ tên" required 
            value={name} onChange={e => setName(e.target.value)} 
            style={{ padding: "8px" }}
          />
          <input 
            type="number" placeholder="Tuổi" required 
            value={age} onChange={e => setAge(e.target.value)} 
            style={{ padding: "8px", width: "60px" }}
          />
          <input 
            type="text" placeholder="Lớp" required 
            value={studentClass} onChange={e => setStudentClass(e.target.value)} 
            style={{ padding: "8px", width: "80px" }}
          />
          <button type="submit" style={{ backgroundColor: "green", color: "white", padding: "8px 15px", border: "none", cursor: "pointer" }}>
            Thêm
          </button>
        </form>
      </div>

      {/* --- BẢNG DANH SÁCH --- */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#007bff", color: "white" }}>
            <th>Họ Tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="3" style={{textAlign:"center"}}>Chưa có dữ liệu</td></tr>
          ) : (
            students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.age}</td>
                <td>{s.class}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;