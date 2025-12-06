const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student');

const app = express();
const PORT = 5000;

// --- PHẦN QUAN TRỌNG ĐỂ TRÁNH LỖI 400 & NETWORK ERROR ---
app.use(cors()); 
app.use(express.json()); // Bắt buộc phải nằm trên các dòng app.post/app.get
// ---------------------------------------------------------

// Kết nối vào cổng 27018 (Docker mới)
mongoose.connect('mongodb://localhost:27018/student_db')
  .then(() => console.log("✅ KẾT NỐI MONGODB THÀNH CÔNG (PORT 27018)"))
  .catch(err => console.error("❌ Lỗi kết nối:", err));

// API Lấy danh sách
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Thêm mới
app.post('/api/students', async (req, res) => {
  console.log("Dữ liệu nhận được:", req.body); // In ra để kiểm tra
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Lỗi lưu DB:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));