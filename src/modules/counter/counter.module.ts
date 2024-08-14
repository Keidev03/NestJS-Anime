import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { CounterSchema } from './counter.schema'
import { CounterService } from './counter.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Counter', schema: CounterSchema }])],
  controllers: [],
  providers: [CounterService],
  exports: [CounterService]
})
export class CounterModule { }
