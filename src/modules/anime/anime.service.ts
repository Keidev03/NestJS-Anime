import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IAnime } from './anime.schema';
import { CreateAnimeDTO, UpdateAnimeDTO } from './dto';
import { GenresService } from '../genres/genres.service';
import { GoogleDriveService } from '../../service/drive.service';


@Injectable()
export class AnimeService {

    private readonly idFolder: string;

    constructor(@InjectModel('Anime') private readonly animeModel: Model<IAnime>, private readonly driveService: GoogleDriveService, private readonly genresService: GenresService) {
        this.idFolder = process.env.FOLDER;
    }

    async CreateAnime(dataCreate: CreateAnimeDTO, imagePoster?: any, imageBackgound?: any) {
        try {
            const arrayCategories = dataCreate.genres;
            const checkCategory = await this.genresService.CheckAllGenresById(arrayCategories);
            if (!checkCategory) {
                throw new NotFoundException('Category not found');
            }
            const idImagePoster = await this.driveService.UploadImage(imagePoster, dataCreate.title, 400, 600, this.idFolder)
            const idImageBackground = await this.driveService.UploadImage(imageBackgound, dataCreate.title, 1920, 1080, this.idFolder)

            const dataInsert = new this.animeModel({
                title: dataCreate.title,
                anotherName: dataCreate.anotherName,
                description: dataCreate.description,
                genres: dataCreate.genres,
                totalEpisode: dataCreate.totalEpisode,
                namePart: dataCreate.namePart,
                releaseDate: dataCreate.releaseDate,
                imagePoster: idImagePoster,
                imageBackground: idImageBackground,
            });
            const movie = await dataInsert.save();
            await this.driveService.PublicFile(idImagePoster);
            await this.driveService.PublicFile(idImageBackground);
            return movie;
        } catch (error) {
            throw error;
        }
    }

    async UpdateAnime(id: string, dataUpdate?: UpdateAnimeDTO, imagePoster?: any, imageBackgound?: any) {
        try {
            const movie = await this.animeModel.findById(id);
            if (!movie) {
                throw new NotFoundException({ message: "Anime not found" })
            }
            if (imagePoster) {
                const idImagePoster = await this.driveService.UploadImage(imagePoster, movie.title, 400, 600, this.idFolder);
                await this.driveService.DeleteFile(movie.imagePoster);
                await this.driveService.PublicFile(idImagePoster);
                await movie.updateOne({ imagePoster: idImagePoster });
            }
            if (imageBackgound) {
                const idImageBackground = await this.driveService.UploadImage(imageBackgound, movie.title, 1920, 1080, this.idFolder);
                await this.driveService.DeleteFile(movie.imageBackground);
                await this.driveService.PublicFile(idImageBackground);
                await movie.updateOne({ imageBackground: idImageBackground });
            }
            const updateAnime = await movie.updateOne(dataUpdate);
            return updateAnime;
        } catch (error) {
            throw error;
        }
    }

    async DeleteAnime(id: string) {
        try {
            const movie = await this.animeModel.findByIdAndDelete(id);
            if (!movie) {
                throw new NotFoundException({ message: "Anime not found" })
            }
            await this.driveService.DeleteFile(movie.imagePoster);
            await this.driveService.DeleteFile(movie.imageBackground);
            return movie;
        } catch (error) {
            throw error;
        }
    }

    async FindAllAnime(page: number, limit: number) {
        try {
            const movies = await this.animeModel.find().populate({ path: 'genres', select: 'name -_id' }).skip((page - 1) * limit).limit(limit);
            if (movies.length < 1) {
                throw new NotFoundException("Anime not found");
            }
            return movies;
        } catch (error) {
            throw error;
        }
    }

    async FindOneAnime(id: string) {
        try {
            const movie = await this.animeModel.findById(id).populate({ path: 'genres', select: 'name -_id' });
            if (!movie) {
                throw new NotFoundException("Movie not found");
            }
            return movie;
        } catch (error) {
            throw error;
        }
    }

    async SearchAnime(query: string): Promise<IAnime[]> {
        try {
            const results = await this.animeModel.find({
                $or: [
                    { title: { $regex: new RegExp(query, 'i') } },
                    { anotherName: { $elemMatch: { $regex: new RegExp(query, 'i') } } }
                ]
            });
            return results;
            return results;
        } catch (error) {
            throw error;
        }
    }
}
