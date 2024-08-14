import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { CommentSchema } from './comment.schema'
import { AnimeModule } from '../anime/anime.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]), AnimeModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule { }
