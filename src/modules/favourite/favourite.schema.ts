import mongoose from "mongoose"

export interface IFavourite {
    id: mongoose.Types.ObjectId
    userID: string,
    animeID: string[],
    createAt: Date,
}

export const FavouriteSchema = new mongoose.Schema({
    userID: { type: mongoose.Types.ObjectId, require: true },
    animeID: [{ type: mongoose.Types.ObjectId, require: true, ref: 'Anime' }],
    createAt: { type: Date, default: Date.now },
})

FavouriteSchema.index({ userID: 1 });