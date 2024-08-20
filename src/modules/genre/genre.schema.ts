import mongoose from "mongoose"

export interface IGenre {
    id: number
    name: string
}

export const GenreSchema = new mongoose.Schema({
    _id: { type: Number, require: true },
    name: { type: String, required: true, unique: true }
})