import mongoose from "mongoose"

export interface IGenres {
    name: string
}

export const GenresSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
})