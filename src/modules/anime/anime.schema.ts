import mongoose from "mongoose"

import { IType } from "../type/type.schema"

export interface IAnime {
    id: mongoose.Types.ObjectId,
    title: string
    anotherName: string[],
    description: string,
    genre: number[],
    totalEpisode: number,
    type: IType,
    releaseDate: Date,
    updateAt: Date,
    createdAt: Date,
    imagePoster: string,
    imageBackground: string
}

export interface ResultFindAllAnime {
    movies: IAnime[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}

export const AnimeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    anotherName: [{ type: String, required: true }],
    description: { type: String, required: true },
    genre: [{ type: Number, ref: 'Genre', required: true }],
    type: { type: Number, ref: 'Type', required: true },
    releaseDate: { type: Date, required: true },
    imagePoster: { type: String, required: true },
    imageBackground: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    // Optional--------------------------

    totalEpisode: { type: Number },
    updateAt: { type: Date },
})

AnimeSchema.index({ releaseDate: 1 })