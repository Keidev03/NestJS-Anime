import mongoose from "mongoose"

export interface IComment {
    id: mongoose.Types.ObjectId
    userID: string,
    animeID: string,
    comment: string,
    like: string,
    dislike: string,
    commentTimeEdit: Date,
    createAt: Date,
}

export const CommentSchema = new mongoose.Schema({
    userID: { type: mongoose.Types.ObjectId, require: true },
    animeID: { type: mongoose.Types.ObjectId, ref: 'Anime', require: true },
    comment: { type: String, require: true },
    like: [{ type: mongoose.Types.ObjectId }],
    dislike: [{ type: mongoose.Types.ObjectId }],
    commentTimeEdit: { type: Date, default: Date.now },
    createAt: { type: Date, default: Date.now },
})
CommentSchema.index({ userID: 1, animeID: 1, commentTime: 1 })