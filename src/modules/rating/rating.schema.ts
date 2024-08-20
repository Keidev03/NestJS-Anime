import mongoose from "mongoose"


export interface IUserRating {
    userID: string
    point: number
}

export interface IRating {
    id: mongoose.Types.ObjectId
    animeID: mongoose.Types.ObjectId
    rating: IUserRating[]
    createAt: Date
}

const UserRatingSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    point: { type: Number, required: true }
})

export const RatingSchema = new mongoose.Schema({
    animeID: { type: mongoose.Types.ObjectId, require: true },
    rating: [UserRatingSchema],
    createAt: { type: Date, default: Date.now },
})

RatingSchema.index({ animeID: 1 })