const express = require("express");
// const monogoose = require("mongoose");
const cors = require("cors");
const mongoose = require("mongoose");
const attendanceRoutes = require('./routes/attendance');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmployeeModel = require("./models/Employee");


const app = express();
app.use(express.json());
app.use(cors());
app.use('/attendance', attendanceRoutes);
const JWT_SECRET = "MYSECRET";

mongoose.connect(
  "mongodb+srv://myaccount-2:TkA0GONCo8kTihTo@cluster0.catvmob.mongodb.net/Register-6"
);

// Register endpoint
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newEmployee = new EmployeeModel({ name, email, password: hashedPassword });
      // Save the employee to database
      await newEmployee.save();
      res.status(201).json({ message: "Registration successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to register" });
    }
  });
  
  // Login endpoint
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      // Find employee by email
      const employee = await EmployeeModel.findOne({ email });
      if (!employee) {
        return res.status(404).json({ message: "User not found" });
      }
      // Compare passwords
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // Generate JWT token
      const token = jwt.sign({ id: employee._id, email: employee.email }, JWT_SECRET, {
        expiresIn: "1h", // Token expires in 1 hour
      });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
app.listen(3001, () => {
  console.log("server is running");
});
