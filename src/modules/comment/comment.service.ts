import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IComment } from './comment.schema';

@Injectable()
export class CommentService {
    constructor(@InjectModel('Comment') private readonly commentModel: Model<IComment>) { }
    async CreateComment(userID: string, animeID: string, comment: string) {
        try {
            const dataInsert = new this.commentModel({
                userID: userID,
                animeID: animeID,
                comment: comment
            });
            const result = await dataInsert.save();
            return result;
        } catch (error) {
            throw error;
        }
    }

    async UpdateComment(userID: string, animeID: string, commentID, comment: string) {
        try {
            const updatedReview = await this.commentModel.findOneAndUpdate(
                { _id: commentID, userID: userID, animeID: animeID },
                { $set: { comment: comment } },
                { new: true }
            );
            if (!updatedReview) {
                throw new NotFoundException('Review not found');
            }
            return updatedReview;
        } catch (error) {
            throw error;
        }
    }

    async FindCommentAnime(animeID: string) {
        try {
            const results = await this.commentModel.find({ animeID: animeID });
            return results;
        } catch (error) {
            throw error;
        }
    }

    async FindCommentUser(userID: string) {
        try {
            const results = await this.commentModel.find({ userID: userID });
            return results;
        } catch (error) {
            throw error;
        }
    }
}
