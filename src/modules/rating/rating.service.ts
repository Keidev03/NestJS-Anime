import { Injectable, NotFoundException } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { IRating } from './rating.schema'
import { AnimeService } from '../anime/anime.service'

@Injectable()
export class RatingService {

    constructor(@InjectModel('Rating') private readonly ratingModel: Model<IRating>, private readonly animeService: AnimeService) { }

    async CreateRating(userID: string, animeID: string, rating: number): Promise<IRating> {
        try {
            const checkAnime = await this.animeService.CheckAnime(animeID)
            if (!checkAnime) throw new Error("Anime not found")
            if (rating < 1 || rating > 10) {
                throw new NotFoundException('Rating value is not valid')
            }
            const checkRating = await this.ratingModel.findOne({ "rating.userID": userID, animeID: animeID });

            if (!checkRating) {
                const dataInsert = new this.ratingModel({
                    animeID: animeID,
                    rating: [{ userID: userID, point: rating }]
                })
                const result = await dataInsert.save()
                return result
            } else {
                const userRating = checkRating.rating.find(r => r.userID === userID)
                if (userRating) {
                    userRating.point = rating
                } else {
                    // Nếu chưa tồn tại, thêm mới vào mảng rating
                    checkRating.rating.push({ userID: userID, point: rating })
                }
                const result = await checkRating.save()
                return result
            }
        } catch (error) {
            throw error
        }
    }

    async DeleteRating(userID: string, animeID: string): Promise<IRating> {
        try {
            const ratingRecord = await this.ratingModel.findOne({ animeID: animeID })
            if (!ratingRecord) throw new NotFoundException('The record table does not exist')

            const userRatingExists = ratingRecord.rating.some(rating => rating.userID === userID)
            if (!userRatingExists) throw new NotFoundException('UserID does not exist in the rating array')

            const result = await this.ratingModel.findOneAndUpdate(
                { animeID: animeID },
                { $pull: { rating: { userID: userID } } },
                { new: true }
            );

            return result
        } catch (error) {
            throw error
        }
    }

    async FindAllRatingAnime(animeID: string): Promise<any> {
        try {
            const checkAnime = await this.animeService.CheckAnime(animeID)
            if (!checkAnime) throw new Error("Anime not found");

            const ratingRecord = await this.ratingModel.findOne({ animeID: animeID })

            if (!ratingRecord || ratingRecord.rating.length === 0) {
                return {
                    averageRating: 0,
                    count: 0,
                };
            }

            const totalRating = ratingRecord.rating.reduce((sum, userRating) => sum + userRating.point, 0)
            const averageRating = totalRating / ratingRecord.rating.length

            return {
                averageRating,
                count: ratingRecord.rating.length,
            };
        } catch (error) {
            throw error
        }
    }
}
