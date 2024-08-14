import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'
import { RatingSchema } from './rating.schema'
import { AnimeModule } from '../anime/anime.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]), AnimeModule],
  controllers: [RatingController],
  providers: [RatingService]
})
export class RatingModule { }
