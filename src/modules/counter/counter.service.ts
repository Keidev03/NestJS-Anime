import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { ICounter } from './counter.schema'

@Injectable()
export class CounterService {

    constructor(@InjectModel('Counter') private readonly counterModel: Model<ICounter>) { }

    getNextSequenceValue = async (sequenceName: any) => {
        const sequenceDocument = await this.counterModel.findByIdAndUpdate(
            sequenceName,
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );
        return sequenceDocument.sequence_value
    }
}