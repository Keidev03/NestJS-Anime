import mongoose from "mongoose"

export interface IGenres {
    id: number
    name: string
}

export const GenresSchema = new mongoose.Schema({
    _id: { type: Number, require: true },
    name: { type: String, required: true, unique: true }
})