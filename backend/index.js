const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student');

const app = express();
const PORT = 5000;

// --- Middleware (Bắt buộc) ---
app.use(cors()); 
app.use(express.json()); 

// --- Kết nối Database (Cổng 27018) ---
mongoose.connect('mongodb://localhost:27018/student_db')
  .then(() => console.log("✅ KẾT NỐI MONGODB THÀNH CÔNG (PORT 27018)"))
  .catch(err => console.error("❌ Lỗi kết nối:", err));

// --- API ---

// 1. Lấy danh sách
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Thêm mới
app.post('/api/students', async (req, res) => {
  console.log("Dữ liệu nhận được:", req.body);
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Lỗi lưu:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// 3. Sửa thông tin
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ error: "Không tìm thấy" });
    }
    console.log("Đã cập nhật:", updatedStudent);
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Khởi động Server
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));