import mongoose from "mongoose"

import { IAnime } from "../anime/anime.schema"

export interface IEpisode {
    id: mongoose.Types.ObjectId
    animeID: IAnime,
    episode: number,
    duration: number,
    releaseDate: Date,
    createAt: Date,
    server1: string,
    server2: string,
    server3: string,
    server4: string,
};

export const EpisodeSchema = new mongoose.Schema({
    animeID: { type: mongoose.Types.ObjectId, required: true, ref: 'Anime' },
    episode: { type: Number, required: true },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    createAt: { type: Date, default: Date.now },
    server1: { type: String },
    server2: { type: String },
    server3: { type: String },
    server4: { type: String },
});

EpisodeSchema.index({ animeID: 1, episode: 1 });