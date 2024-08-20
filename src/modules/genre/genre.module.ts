import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { GenreSchema } from './genre.schema'
import { CounterModule } from '../counter/counter.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Genre', schema: GenreSchema }]), CounterModule],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService]
})
export class GenreModule { }
