import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskName: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Task', taskSchema);
