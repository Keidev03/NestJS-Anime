import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { MongooseModule } from '@nestjs/mongoose';

import { AnimeSchema } from './anime.schema';
import { GoogleDriveService } from '../../service/drive.service';
import { GenresModule } from '../genres/genres.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Anime', schema: AnimeSchema }]), GenresModule],
  controllers: [AnimeController],
  providers: [AnimeService, GoogleDriveService],
  exports: [AnimeService]
})
export class AnimeModule { }
