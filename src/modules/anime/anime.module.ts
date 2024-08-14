import { Module } from '@nestjs/common'
import { AnimeController } from './anime.controller'
import { AnimeService } from './anime.service'
import { MongooseModule } from '@nestjs/mongoose'

import { AnimeSchema } from './anime.schema'
import { GoogleDriveService } from '../../service/drive.service'
import { GenresModule } from '../genres/genres.module'
import { TypeModule } from '../type/type.module'
import { ConvertDateService } from '../../service/date.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Anime', schema: AnimeSchema }]), GenresModule, TypeModule],
  controllers: [AnimeController],
  providers: [AnimeService, GoogleDriveService, ConvertDateService],
  exports: [AnimeService]
})
export class AnimeModule { }
