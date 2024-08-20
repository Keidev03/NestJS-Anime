import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IType } from './type.schema'
import { CounterService } from '../counter/counter.service'

@Injectable()
export class TypeService {
    constructor(@InjectModel('Type') private readonly typeModel: Model<IType>, private readonly counterService: CounterService) { }

    public CheckType = async (id: string): Promise<boolean> => {
        try {
            const type = await this.typeModel.findById(id)
            return !!type
        } catch (error) {
            throw error
        }
    }

    async CreateType(type: string): Promise<IType> {
        try {
            const checkType = await this.typeModel.findOne({ name: type })
            if (checkType) {
                throw new ConflictException("This genre already exists")
            }
            const uniqueID: number = await this.counterService.getNextSequenceValue("typeID")
            const dataInsert = new this.typeModel({ _id: uniqueID, name: type })
            const result = await dataInsert.save()
            return result
        } catch (error) {
            throw error
        }
    }

    async DeleteType(id: string): Promise<IType> {
        try {
            const type = await this.typeModel.findByIdAndDelete(id)
            return type
        } catch (error) {
            throw error
        }
    }

    async FindAllType(): Promise<IType[]> {
        try {
            const type = await this.typeModel.find()
            if (type.length < 1) {
                throw new NotFoundException("Type not found")
            }
            return type
        } catch (error) {
            throw error
        }
    }
}
