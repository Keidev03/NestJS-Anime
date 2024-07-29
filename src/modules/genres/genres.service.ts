import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IGenres } from './genres.schema';

@Injectable()
export class GenresService {
    constructor(@InjectModel('Genres') private readonly genresModel: Model<IGenres>) { }

    async CreateGenres(genres: string) {
        try {
            const checkGenres = await this.genresModel.findOne({ name: genres });
            if (checkGenres) {
                throw new ConflictException("This genre already exists")
            }
            const dataInsert = new this.genresModel({ name: genres });
            const result = await dataInsert.save();
            return result;
        } catch (error) {
            throw error
        }
    }

    async DeleteGenres(id: string) {
        try {
            const genres = await this.genresModel.findByIdAndDelete(id);
            return genres;
        } catch (error) {
            throw error;
        }
    }

    async FindAllGenres() {
        try {
            const genres = await this.genresModel.find();
            if (genres.length < 1) {
                throw new NotFoundException("Genres not found");
            }
            return genres;
        } catch (error) {
            throw error;
        }
    }

    async FindOneGenres(id: string) {
        try {
            const genres = await this.genresModel.findById(id);
            if (!genres) {
                throw new NotFoundException("Genres not found");
            }
            return genres;
        } catch (error) {
            throw error;
        }
    }

    async CheckAllGenresById(ids: string[]) {
        try {
            const legnth = ids.length;
            const genres = await this.genresModel.find({ _id: { $in: ids } });
            if (genres.length < legnth) {
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}
