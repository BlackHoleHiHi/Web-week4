// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Bạn có thể thêm CSS tùy ý

function App() {
  // State quản lý danh sách và form
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', class: '' });
  const [editingId, setEditingId] = useState(null); // ID đang sửa (null nếu là thêm mới)
  
  // State tìm kiếm và sắp xếp
  const [searchTerm, setSearchTerm] = useState(""); // [cite: 288]
  const [sortAsc, setSortAsc] = useState(true);     // [cite: 321]

  // Fetch dữ liệu khi load trang [cite: 78]
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (error) {
      console.error("Lỗi fetch data:", error);
    }
  };

  // Xử lý thay đổi input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Xử lý Submit (Thêm hoặc Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentData = { ...form, age: Number(form.age) };

    try {
      if (editingId) {
        // Logic Sửa (PUT) [cite: 213]
        const res = await axios.put(`http://localhost:5000/api/students/${editingId}`, studentData);
        setStudents(prev => prev.map(s => s._id === editingId ? res.data : s)); // Cập nhật state
        setEditingId(null); // Reset trạng thái sửa
      } else {
        // Logic Thêm (POST) [cite: 127]
        const res = await axios.post('http://localhost:5000/api/students', studentData);
        setStudents(prev => [...prev, res.data]); // Thêm vào state
      }
      // Reset form
      setForm({ name: '', age: '', class: '' });
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
    }
  };

  // Logic Xóa [cite: 263]
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  // Logic chọn để Sửa (đổ dữ liệu vào form) 
  const handleEdit = (student) => {
    setForm({ name: student.name, age: student.age, class: student.class });
    setEditingId(student._id);
  };

  // --- XỬ LÝ HIỂN THỊ (TÌM KIẾM & SẮP XẾP) ---

  // 1. Lọc theo tên 
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sắp xếp danh sách đã lọc 
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Quản Lý Học Sinh</h1>

      {/* Form Thêm/Sửa */}
      <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
        <h3>{editingId ? "Cập nhật thông tin" : "Thêm học sinh mới"}</h3>
        <form onSubmit={handleSubmit}>
          <input 
            name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} required style={{ marginRight: '5px'}} 
          />
          <input 
            name="age" type="number" placeholder="Tuổi" value={form.age} onChange={handleChange} required style={{ marginRight: '5px'}} 
          />
          <input 
            name="class" placeholder="Lớp" value={form.class} onChange={handleChange} required style={{ marginRight: '5px'}} 
          />
          <button type="submit">{editingId ? "Cập Nhật" : "Thêm Mới"}</button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setForm({name:'',age:'',class:''})}} style={{marginLeft:'5px'}}>Hủy</button>}
        </form>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Nút Sắp xếp */}
      <div style={{ marginBottom: '20px' }}>
        <input 
  type="text" 
  placeholder="Tìm kiếm theo tên..." 
  value={searchTerm}
  onChange={e => setSearchTerm(e.target.value)}
  style={{ padding: '5px', width: '200px', marginRight: '10px' }}
/>
        
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'} 
        </button> {/* [cite: 322] */}
      </div>

      {/* Bảng danh sách */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Họ Tên</th>
            <th>Tuổi</th>
            <th>Lớp</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.length > 0 ? (
            sortedStudents.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.class}</td>
                <td>
                  <button onClick={() => handleEdit(student)} style={{ marginRight: '5px' }}>Sửa</button>
                  <button onClick={() => handleDelete(student._id)} style={{ color: 'red' }}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy học sinh nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;