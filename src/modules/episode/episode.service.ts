import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IEpisode } from './episode.schema'
import { CreateEpisodeDTO, UpdateEpisodeDTO } from './dto'
import { ConvertCSVService } from './../../service/csv.service'
import { AnimeService } from '../anime/anime.service'
import { ConvertDateService } from '../../service/date.service'

@Injectable()
export class EpisodeService {

    constructor(@InjectModel('Episode') private readonly episodeModel: Model<IEpisode>, private readonly animeService: AnimeService, private readonly convertCSV: ConvertCSVService, private readonly convertDateService: ConvertDateService) { }

    private CheckEpisodeAnime = async (animeID: string, episode: number): Promise<boolean> => {
        try {
            const result = await this.episodeModel.findOne({ animeID: animeID, episode: episode })
            return !!result
        } catch (error) {
            throw error
        }
    }

    async CreateEpisode(data: CreateEpisodeDTO): Promise<IEpisode> {
        try {
            const checkAnime = await this.animeService.CheckAnime(data.animeID)
            if (!checkAnime) throw new Error("Anime not found")
            const checkEpisode = await this.CheckEpisodeAnime(data.animeID, data.episode)
            if (checkEpisode) throw new Error("Episode already exists")

            const date: any = await this.convertDateService.DateToISO(data.releaseDate)

            const dataInsert = new this.episodeModel({
                animeID: data.animeID,
                episode: data.episode,
                duration: data.duration,
                releaseDate: date,
                server1: data.server1,
                server2: data.server2,
                server3: data.server3,
                server4: data.server4,
            });
            const result = await dataInsert.save()
            return result
        } catch (error) {
            throw error
        }
    }

    async CreateManyEpisode(file: Object): Promise<any> {
        try {
            const hearder: string[] = ['animeID', 'episode', 'duration', 'releaseDate', 'server1', 'server2', 'server3', 'server4']
            const dataInsert: CreateEpisodeDTO[] = await this.convertCSV.CSVToJSON(file, hearder)

            const filteredDataInsert = await Promise.all(dataInsert.map(async (anime) => {

                const checkAnime = await this.animeService.CheckAnime(anime.animeID)
                const checkEpisode = await this.CheckEpisodeAnime(anime.animeID, anime.episode)

                if (!checkAnime || checkEpisode) {
                    return null
                }
                return anime
            }))

            const validDataInsert = filteredDataInsert.filter(item => item !== null) as CreateEpisodeDTO[]

            for (let i = 0; i < validDataInsert.length; i++) {
                const date: any = await this.convertDateService.DateToISO(validDataInsert[i].releaseDate);
                if (date) {
                    validDataInsert[i].releaseDate = date;
                }
            }

            const episodes = await this.episodeModel.insertMany(validDataInsert)

            return episodes

        } catch (error) {
            throw error
        }
    }

    async UpdateEpisode(id: string, data: UpdateEpisodeDTO): Promise<IEpisode> {
        try {
            const episode = await this.episodeModel.findById(id)
            if (!episode) {
                throw new NotFoundException('Episode not found')
            }
            if (data.releaseDate) {
                const date: any = this.convertDateService.DateToISO(data.releaseDate)
                data.releaseDate = date
            }
            const result = episode.updateOne(data)
            return result
        } catch (error) {
            throw error
        }
    }

    async DeleteEpisode(id: string): Promise<IEpisode> {
        try {
            const result = await this.episodeModel.findByIdAndDelete(id)
            return result
        } catch (error) {
            throw error
        }
    }

    async FindAllEpisodeAnime(animeID: string): Promise<IEpisode[]> {
        try {
            const result = await this.episodeModel
                .find({ animeID: animeID })
                .populate({ path: 'animeID', select: 'title' })
                .sort({ episode: 1 })
            if (result.length === 0) {
                throw new NotFoundException('The anime has not been shown yet')
            };
            return result
        } catch (error) {
            throw error
        }
    }

}
