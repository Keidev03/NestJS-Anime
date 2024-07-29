import { Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './episode.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EpisodeSchema } from './episode.schema';
import { ConvertCSVService } from '../../service/csv.service';
import { AnimeModule } from '../anime/anime.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Episode', schema: EpisodeSchema }]), AnimeModule],
  controllers: [EpisodeController],
  providers: [EpisodeService, ConvertCSVService]
})
export class EpisodeModule { }
