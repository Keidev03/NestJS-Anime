import mongoose from "mongoose"

export interface IComment {
    userID: string,
    animeID: string,
    comment: string,
    commentTime: Date
}

export const CommentSchema = new mongoose.Schema({
    userID: { type: mongoose.Types.ObjectId, require: true },
    animeID: { type: mongoose.Types.ObjectId, require: true },
    comment: { type: String, require: true },
    commentTime: { type: Date, default: new Date() }
})
CommentSchema.index({ userID: 1, animeID: 1, commentTime: 1 });