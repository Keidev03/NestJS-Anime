import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { AnimeModule } from './modules/anime/anime.module'
import { GenreModule } from './modules/genre/genre.module'
import { EpisodeModule } from './modules/episode/episode.module'
import { RatingModule } from './modules/rating/rating.module'
import { CommentModule } from './modules/comment/comment.module'
import { FavouriteModule } from './modules/favourite/favourite.module'
import { TypeModule } from './modules/type/type.module'
import config from './config'

console.log(config.env.URI)

@Module({
  imports: [
    MongooseModule.forRoot(config.env.URI),
    JwtModule.register({
      global: true
    }),
    AnimeModule,
    GenreModule,
    TypeModule,
    EpisodeModule,
    RatingModule,
    CommentModule,
    FavouriteModule
  ],
})
export class AppModule { }