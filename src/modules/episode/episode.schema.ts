import mongoose from "mongoose"

export interface IEpisode {
    animeID: string
    episode: number,
    duration: number,
    releaseDate: Date,
    serverDrive: string,
    serverHydrax: string,
    serverHelvid: string,
    serverDaily: string,
};

export const EpisodeSchema = new mongoose.Schema({
    animeID: { type: mongoose.Types.ObjectId, required: true, ref: 'Anime' },
    episode: { type: Number, required: true },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    serverDrive: { type: String },
    serverHydrax: { type: String },
    serverHelvid: { type: String },
    serverDaily: { type: String },
});

EpisodeSchema.index({ animeID: 1, episode: 1 });