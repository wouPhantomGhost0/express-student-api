const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    building: String
});

module.exports = mongoose.model('Department', departmentSchema);