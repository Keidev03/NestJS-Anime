import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IAnime, ResultFindAllAnime } from './anime.schema'
import { CreateAnimeDTO, UpdateAnimeDTO } from './dto'
import { GenresService } from '../genres/genres.service'
import { GoogleDriveService } from '../../service/drive.service'
import { TypeService } from '../type/type.service'
import { ConvertDateService } from '../../service/date.service'

@Injectable()
export class AnimeService {

    private readonly idFolder: string;

    constructor(@InjectModel('Anime') private readonly animeModel: Model<IAnime>, private readonly driveService: GoogleDriveService, private readonly genresService: GenresService, private readonly typeService: TypeService, private readonly convertDateService: ConvertDateService) {
        this.idFolder = process.env.FOLDER;
    }

    public CheckAnime = async (id: string): Promise<boolean> => {
        try {
            const checkAnime = await this.FindOneAnime(id)
            if (!checkAnime) {
                return false
            }
            return true
        } catch (error) {
            throw error
        }
    }

    async CreateAnime(dataCreate: CreateAnimeDTO, imagePoster?: any, imageBackgound?: any): Promise<IAnime> {
        try {
            const arrayGenres = dataCreate.genres;
            const checkGenres = await this.genresService.CheckGenresById(arrayGenres)
            if (!checkGenres) {
                throw new NotFoundException('Genres not found')
            }
            const checkType = await this.typeService.CheckType(dataCreate.type)
            if (!checkType) {
                throw new NotFoundException('checkType not found')
            }

            const date: string = await this.convertDateService.DateToISO(dataCreate.releaseDate)

            const idImagePoster = await this.driveService.UploadImage(imagePoster, dataCreate.title, 400, 600, this.idFolder)
            const idImageBackground = await this.driveService.UploadImage(imageBackgound, dataCreate.title, 1920, 1080, this.idFolder)


            const dataInsert = new this.animeModel({
                title: dataCreate.title,
                anotherName: dataCreate.anotherName,
                description: dataCreate.description,
                genres: dataCreate.genres,
                totalEpisode: dataCreate.totalEpisode,
                type: dataCreate.type,
                releaseDate: date,
                imagePoster: idImagePoster,
                imageBackground: idImageBackground,
            });
            const movie = await dataInsert.save();
            return movie
        } catch (error) {
            throw error
        }
    }

    async UpdateAnime(id: string, dataUpdate?: UpdateAnimeDTO, imagePoster?: any, imageBackgound?: any): Promise<IAnime> {
        try {
            const movie = await this.animeModel.findById(id)
            if (!movie) {
                throw new NotFoundException({ message: "Anime not found" })
            }
            if (imagePoster) {
                const idImagePoster = await this.driveService.UploadImage(imagePoster, movie.title, 400, 600, this.idFolder);
                await this.driveService.DeleteFile(movie.imagePoster)
                await movie.updateOne({ imagePoster: idImagePoster })
            }
            if (imageBackgound) {
                const idImageBackground = await this.driveService.UploadImage(imageBackgound, movie.title, 1920, 1080, this.idFolder);
                await this.driveService.DeleteFile(movie.imageBackground)
                await movie.updateOne({ imageBackground: idImageBackground })
            }
            if (dataUpdate.releaseDate) {
                const date: any = await this.convertDateService.DateToISO(dataUpdate.releaseDate)
                dataUpdate.releaseDate = date
            }
            const updateAnime = await movie.updateOne(dataUpdate)
            return updateAnime
        } catch (error) {
            throw error
        }
    }

    async DeleteAnime(id: string): Promise<IAnime> {
        try {
            const movie = await this.animeModel.findByIdAndDelete(id)
            if (!movie) {
                throw new NotFoundException({ message: "Anime not found" })
            }
            await this.driveService.DeleteFile(movie.imagePoster)
            await this.driveService.DeleteFile(movie.imageBackground)
            return movie
        } catch (error) {
            throw error
        }
    }

    async FindAllAnime(genres?: string[], type?: string, page: number = 1, limit: number = 20): Promise<ResultFindAllAnime> {
        try {
            page = Math.max(1, page)
            limit = Math.min(30, Math.max(1, limit))
            const filter: any = {}
            genres && (filter.genres = { $in: genres })
            type && (filter.type = type)
            const totalRecords = await this.animeModel.countDocuments()
            const totalPages = Math.ceil(totalRecords / limit)
            const movies = await this.animeModel
                .find(filter)
                .populate({ path: 'genres', select: 'name -_id' })
                .populate({ path: 'type', select: 'name -_id' })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })

            if (movies.length < 1) {
                throw new NotFoundException("Anime not found")
            }

            return {
                movies,
                currentPage: page,
                totalPages,
                totalRecords,
            }

        } catch (error) {
            throw error
        }
    }

    async FindOneAnime(id: string): Promise<IAnime> {
        try {
            const movie = await this.animeModel
                .findById(id)
                .populate({ path: 'genres', select: 'name -_id' })
                .populate({ path: 'type', select: 'name -_id' })
            if (!movie) {
                throw new NotFoundException("Movie not found")
            }
            return movie;
        } catch (error) {
            throw error;
        }
    }

    async SearchAnime(keyword: string, genres?: string[], type?: string, page: number = 1, limit: number = 20): Promise<IAnime[]> {
        try {
            page = Math.max(1, page)
            limit = Math.min(30, Math.max(1, limit))
            const filter: any = {}
            genres && genres.length > 0 && (filter.genres = { $in: genres })
            type && (filter.type = type)
            const adjustedKeyword = keyword.split('').join('\\s*')
            const searchCondition = {
                $or: [
                    { title: { $regex: new RegExp(adjustedKeyword, 'i') } },
                    { anotherName: { $elemMatch: { $regex: new RegExp(adjustedKeyword, 'i') } } }
                ]
            };
            if (Object.keys(filter).length === 0) {
                const results = await this.animeModel
                    .find(searchCondition)
                    .skip((page - 1) * limit)
                    .limit(limit)
                return results;
            } else {
                const results = await this.animeModel.find({
                    $and: [searchCondition, filter]
                });
                return results
            }
        } catch (error) {
            throw error
        }
    }
}
