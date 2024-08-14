import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { AnimeModule } from './modules/anime/anime.module'
import { GenresModule } from './modules/genres/genres.module'
import { EpisodeModule } from './modules/episode/episode.module'
import { RatingModule } from './modules/rating/rating.module'
import { CommentModule } from './modules/comment/comment.module'
import { FavouriteModule } from './modules/favourite/favourite.module'
import { TypeModule } from './modules/type/type.module'
import config from './config'

@Module({
  imports: [
    // start eviroment node
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    // }),
    MongooseModule.forRoot(config.env.URI),
    JwtModule.register({
      global: true
    }),
    AnimeModule,
    GenresModule,
    TypeModule,
    EpisodeModule,
    RatingModule,
    CommentModule,
    FavouriteModule
  ],
})
export class AppModule { }