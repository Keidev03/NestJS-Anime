import mongoose from "mongoose"

export interface IRating {
    userID: string,
    animeID: string,
    rating: number
}

export const RatingSchema = new mongoose.Schema({
    userID: { type: mongoose.Types.ObjectId, require: true },
    animeID: { type: mongoose.Types.ObjectId, require: true },
    rating: { type: Number, require: true }
})

RatingSchema.index({ userID: 1, animeID: 1 });