import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatarUrl: { type: String }
})

export const User = mongoose.model('users', UserSchema)
