import mongoose from "mongoose"

export interface IAnime {
    id: string,
    title: string
    anotherName: string[],
    description: string,
    genres: string[],
    totalEpisode: string,
    namePart: string,
    releaseDate: Date,
    updateAt: Date,
    imagePoster: string,
    imageBackground: string
}

export const AnimeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    anotherName: [{ type: String, required: true }],
    description: { type: String, required: true },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genres', required: true }],
    namePart: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    imagePoster: { type: String, required: true },
    imageBackground: { type: String, required: true },

    // Optional--------------------------

    totalEpisode: { type: String },
    updateAt: { type: Date },
})