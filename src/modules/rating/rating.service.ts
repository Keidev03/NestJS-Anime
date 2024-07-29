import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { IRating } from './rating.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RatingService {
    constructor(@InjectModel('Rating') private readonly ratingModel: Model<IRating>) { }
    async CreateRating(userID: string, animeID: string, rating: number) {
        try {
            if (rating < 1 || rating > 10) {
                throw new NotFoundException('Rating value is not valid');
            }
            const checkRating = await this.ratingModel.findOne({ userID: userID, animeID: animeID });
            if (!checkRating) {
                const dataInsert = new this.ratingModel({
                    userID: userID,
                    animeID: animeID,
                    rating: rating
                });
                const result = await dataInsert.save();
                return result;
            }
            checkRating.rating = rating;
            const result = await checkRating.save();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async DeleteRating(userID: string, animeID: string) {
        try {
            const ratingRecord = await this.ratingModel.findOne({ userID: userID, animeID: animeID });
            if (!ratingRecord) {
                throw new NotFoundException('The record table does not exist')
            }
            const result = await ratingRecord.deleteOne();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async FindAllRatingAnime(animeID: string) {
        try {
            const result: { averageRating: number; count: number } = {
                averageRating: 0,
                count: 0,
            };
            const countRating = await this.ratingModel.find({ animeID: animeID });

            if (countRating.length === 0) {
                result.averageRating = 0;
                result.count = 0;
            } else {
                const totalRating = countRating.reduce((sum, rating) => sum + rating.rating, 0);
                result.averageRating = totalRating / countRating.length;
                result.count = countRating.length;
            }

            return result;
        } catch (error) {
            throw error;
        }
    }
}
