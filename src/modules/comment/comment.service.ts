import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IComment } from './comment.schema'
import { AnimeService } from '../anime/anime.service'

@Injectable()
export class CommentService {
    constructor(@InjectModel('Comment') private readonly commentModel: Model<IComment>, private readonly animeService: AnimeService) { }

    async CreateComment(userID: string, animeID: string, comment: string): Promise<IComment> {
        try {
            const checkAnime = await this.animeService.CheckAnime(animeID)
            if (!checkAnime) throw new Error("Anime not found")
            const dataInsert = new this.commentModel({
                userID: userID,
                animeID: animeID,
                comment: comment
            });
            const result = await dataInsert.save()
            return result
        } catch (error) {
            throw error
        }
    }

    async UpdateComment(userID: string, animeID: string, commentID: string, comment: string): Promise<IComment> {
        try {
            const checkAnime = await this.animeService.CheckAnime(animeID)
            if (!checkAnime) throw new Error("Anime not found")
            const updatedComment = await this.commentModel.findOneAndUpdate(
                { _id: commentID, userID: userID, animeID: animeID },
                { $set: { comment: comment, commentTimeEdit: Date.now() } },
                { new: true }
            );
            if (!updatedComment) {
                throw new NotFoundException('Review not found')
            }
            return updatedComment
        } catch (error) {
            throw error
        }
    }

    async FindCommentAnime(animeID: string): Promise<IComment[]> {
        try {
            const checkAnime = await this.animeService.CheckAnime(animeID)
            if (!checkAnime) throw new Error("Anime not found")
            const results = await this.commentModel
                .find({ animeID: animeID })
                .sort({ createdAt: -1 })
            return results
        } catch (error) {
            throw error
        }
    }

    async FindCommentUser(userID: string): Promise<IComment[]> {
        try {
            const results = await this.commentModel
                .find({ userID: userID })
                .sort({ createdAt: -1 })
            return results
        } catch (error) {
            throw error
        }
    }
}
