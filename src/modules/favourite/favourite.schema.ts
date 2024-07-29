import mongoose from "mongoose";

export interface IFavourite {
    userID: string,
    animeID: string[]
}

export const FavouriteSchema = new mongoose.Schema({
    userID: { type: mongoose.Types.ObjectId, require: true },
    animeID: [{ type: mongoose.Types.ObjectId, require: true, ref: 'Anime' }]
})

FavouriteSchema.index({ userID: 1 });