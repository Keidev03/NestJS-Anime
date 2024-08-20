import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IFavourite } from './favourite.schema'
import { AnimeService } from '../anime/anime.service'

@Injectable()
export class FavouriteService {
    constructor(@InjectModel('Favourite') private readonly favouriteModel: Model<IFavourite>, private readonly animeService: AnimeService) { }

    async AddAnimeFavourite(userID: string, animeID: Array<string>): Promise<IFavourite> {
        try {
            for (let ani of animeID) {
                const checkAnime = await this.animeService.CheckAnime(ani)
                if (!checkAnime) throw new Error("Anime not found")
            }

            let userFavourite = await this.favouriteModel.findOne({ userID: userID })

            if (!userFavourite) {
                userFavourite = new this.favouriteModel({
                    userID: userID,
                    animeID: [...new Set(animeID)],
                });
            } else {
                const newAnimeID = animeID.filter(id => !userFavourite.animeID.includes(id))
                if (newAnimeID.length === 0) {
                    throw new NotFoundException("Anime already exist");
                }
                userFavourite.animeID = [...userFavourite.animeID, ...newAnimeID]
            }
            const result = await userFavourite.save()
            return result
        } catch (error) {
            throw error
        }
    }

    async DeleteAnimeFavourite(userID: string, animeID: string): Promise<IFavourite> {
        try {
            const checkAnime = await this.animeService.CheckAnime(animeID)
            if (!checkAnime) throw new Error("Anime not found")
            const userFavourite = await this.favouriteModel.findOne({ userID: userID })
            if (!userFavourite) {
                throw new NotFoundException()
            }
            if (userFavourite.animeID.length === 0) {
                const result = await userFavourite.deleteOne()
                return result
            }
            if (!userFavourite.animeID.includes(animeID)) {
                throw new NotFoundException('Anime does not exist in favorites list')
            }
            const newArrayAnime = userFavourite.animeID.filter(value => value.toString() !== animeID)
            const result = await userFavourite.updateOne({ animeID: newArrayAnime })
            return result
        } catch (error) {
            throw error
        }
    }

    async FindAllFavourite(userID: string, page: number, limit: number): Promise<IFavourite[]> {
        try {
            const result = await this.favouriteModel
                .find({ userID: userID })
                .populate({ path: 'animeID' })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createAt: -1 })
            return result
        } catch (error) {
            throw error
        }
    }
}
