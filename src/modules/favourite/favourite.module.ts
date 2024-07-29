import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteController } from './favourite.controller';
import { FavouriteService } from './favourite.service';
import { FavouriteSchema } from './favourite.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Favourite', schema: FavouriteSchema }])],
  controllers: [FavouriteController],
  providers: [FavouriteService]
})
export class FavouriteModule { }
