import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    standard: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const studentModel = mongoose.model('student', studentSchema)

export default studentModel