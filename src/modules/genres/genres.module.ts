import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GenresSchema } from './genres.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Genres', schema: GenresSchema }])],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService]
})
export class GenresModule { }
