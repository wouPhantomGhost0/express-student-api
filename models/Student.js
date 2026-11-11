const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    isActive: Boolean,

    gpa: { type: Number, default: 3.5 },
    status: { type: String, default: 'active' },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    emergencyContacts: [{
        name: String,
        phone: String,
        relation: String
    }]

});

module.exports = mongoose.model('Student', studentSchema);
