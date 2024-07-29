import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFavourite } from './favourite.schema';

@Injectable()
export class FavouriteService {
    constructor(@InjectModel('Favourite') private readonly favouriteModel: Model<IFavourite>) { }

    async AddAnimeFavourite(userID: string, animeID: string) {
        try {

            const userFavourite = await this.favouriteModel.findOne({ userID: userID });
            if (!userFavourite) {
                const dataInsert = new this.favouriteModel({
                    userID: userID,
                    animeID: animeID
                })
                const result = await dataInsert.save();
                return result;
            }
            if (userFavourite.animeID.includes(animeID)) {
                throw new NotFoundException('Anime already exists in the favorites list');
            }
            userFavourite.animeID = [...userFavourite.animeID, animeID]
            const result = await userFavourite.save();
            return result;
        } catch (error) {
            throw error
        }
    }

    async DeleteAnimeFavourite(userID: string, animeID: string) {
        try {
            const userFavourite = await this.favouriteModel.findOne({ userID: userID });
            if (!userFavourite) {
                throw new NotFoundException();
            }
            if (userFavourite.animeID.length === 0) {
                const result = await userFavourite.deleteOne();
                return result;
            }
            if (!userFavourite.animeID.includes(animeID)) {
                throw new NotFoundException('Anime does not exist in favorites list');
            }
            const newArrayAnime = userFavourite.animeID.filter(value => value.toString() !== animeID);
            const result = await userFavourite.updateOne({ animeID: newArrayAnime });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async FindAllFavourite(userID: string, page: number, limit: number) {
        try {
            const result = await this.favouriteModel.find({ userID: userID }).populate({ path: 'animeID' }).skip((page - 1) * limit).limit(limit);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
