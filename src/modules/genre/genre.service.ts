import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IGenre } from './genre.schema'
import { CounterService } from '../counter/counter.service'

@Injectable()
export class GenreService {
    constructor(@InjectModel('Genre') private readonly genreModel: Model<IGenre>, private readonly counterService: CounterService) { }

    public CheckGenreById = async (ids: number[]): Promise<boolean> => {
        try {
            const legnth = ids.length
            const genre = await this.genreModel.find({ _id: { $in: ids } })
            if (genre.length < legnth) {
                return false
            }
            return true
        } catch (error) {
            throw error
        }
    }

    async CreateGenre(genre: string): Promise<IGenre> {
        try {
            const checkGenre = await this.genreModel.findOne({ name: genre })
            if (checkGenre) {
                throw new ConflictException("This genre already exists")
            }
            const uniqueID: number = await this.counterService.getNextSequenceValue("genreID")
            const dataInsert = new this.genreModel({ _id: uniqueID, name: genre })
            const result = await dataInsert.save()
            return result
        } catch (error) {
            throw error
        }
    }

    async DeleteGenre(id: string): Promise<IGenre> {
        try {
            const genre = await this.genreModel.findByIdAndDelete(id)
            return genre
        } catch (error) {
            throw error
        }
    }

    async FindAllGenre(): Promise<IGenre[]> {
        try {
            const allGenre = await this.genreModel.find()
            if (allGenre.length < 1) {
                throw new NotFoundException("Genre not found")
            }
            return allGenre
        } catch (error) {
            throw error
        }
    }

}
