import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    role:{
        type: String
    }
})

export default mongoose.models.User || mongoose.model('User', userSchema);