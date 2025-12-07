import express, { Request, Response } from 'express';
import Student, { IStudent } from '../models/Student';

const router = express.Router();

// Create a new student
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, exam } = req.body;
    
    const student = new Student({
      studentId: Date.now().toString(),
      name,
      exam,
      password: name, // Password is same as student name by default
      status: 'offline',
      timeElapsed: '00:00:00',
      riskScore: 0
    });
    
    const savedStudent = await student.save();
    
    res.status(201).json({
      id: savedStudent.studentId,
      name: savedStudent.name,
      exam: savedStudent.exam,
      status: savedStudent.status,
      timeElapsed: savedStudent.timeElapsed,
      riskScore: savedStudent.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error });
  }
});

// Get all students
router.get('/', async (req: Request, res: Response) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    
    const studentList = students.map(student => ({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    }));
    
    res.json(studentList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
});

// Get student by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error });
  }
});

// Update student status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      { status },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student status', error });
  }
});

// Update student risk score
router.patch('/:id/risk-score', async (req: Request, res: Response) => {
  try {
    const { riskScore } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      { riskScore },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({
      id: student.studentId,
      name: student.name,
      exam: student.exam,
      status: student.status,
      timeElapsed: student.timeElapsed,
      riskScore: student.riskScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student risk score', error });
  }
});

// Verify student credentials
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { studentId, password } = req.body;
    
    // Verify student exists and password matches
    const student = await Student.findOne({ studentId });
    
    if (student && password === student.password) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying credentials', error });
  }
});

export default router;