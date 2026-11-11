const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const requireAuth = require('../middleware/auth');


router.get('/stats/department-gpa', async (req, res) => {
  try {
    const stats = await Student.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$departmentId',
          totalStudents: { $sum: 1 },
          avgGpa: { $avg: '$gpa' }
        }
      },
      { $sort: { avgGpa: -1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
      .populate('departmentId', 'name code -_id'); // Field selection
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /students create a new record
router.post('/', requireAuth, async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /students/:id update a record by existing record
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /students/:id remove a record
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully', deletedStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;