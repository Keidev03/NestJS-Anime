import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IGenres } from './genres.schema';
import { CounterService } from '../counter/counter.service';

@Injectable()
export class GenresService {
    constructor(@InjectModel('Genres') private readonly genresModel: Model<IGenres>, private readonly counterService: CounterService) { }

    public CheckGenresById = async (ids: number[]): Promise<boolean> => {
        try {
            const legnth = ids.length
            const genres = await this.genresModel.find({ _id: { $in: ids } })
            if (genres.length < legnth) {
                return false
            }
            return true
        } catch (error) {
            throw error
        }
    }

    async CreateGenres(genre: string): Promise<IGenres> {
        try {
            const checkGenres = await this.genresModel.findOne({ name: genre })
            if (checkGenres) {
                throw new ConflictException("This genre already exists")
            }
            const uniqueID: number = await this.counterService.getNextSequenceValue("genresID")
            const dataInsert = new this.genresModel({ _id: uniqueID, name: genre })
            const result = await dataInsert.save()
            return result
        } catch (error) {
            throw error
        }
    }

    async DeleteGenres(id: string): Promise<IGenres> {
        try {
            const genres = await this.genresModel.findByIdAndDelete(id)
            return genres
        } catch (error) {
            throw error
        }
    }

    async FindAllGenres(): Promise<IGenres[]> {
        try {
            const genres = await this.genresModel.find()
            if (genres.length < 1) {
                throw new NotFoundException("Genres not found")
            }
            return genres
        } catch (error) {
            throw error
        }
    }

}
