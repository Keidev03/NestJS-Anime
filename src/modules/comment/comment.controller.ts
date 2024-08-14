import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'

import { CommentService } from './comment.service'
import { AuthGuard } from '../../guards/auth.guard'

@Controller('comment')
export class CommentController {

    constructor(private readonly commentService: CommentService) { }

    @UseGuards(AuthGuard)
    @Post('create/:animeID')
    async PostComment(@Req() req: any, @Param('animeID') animeID: string, @Body('comment') comment: string) {
        try {
            await this.commentService.CreateComment(req.user.id, animeID, comment);
            const response: Record<string, any> = {
                Message: "Create successfully",
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Put('update/:animeID/:commentID')
    async PutComment(@Req() req: any, @Param('animeID') animeID: string, @Param('commentID') commentID: string, @Body('comment') comment: string) {
        try {
            const result = await this.commentService.UpdateComment(req.user.id, animeID, commentID, comment);
            const response: Record<string, any> = {
                Message: "Update successfully",
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Get('anime/:animeID')
    async GetCommentAnime(@Param('animeID') animeID: string) {
        try {
            const results: any = await this.commentService.FindCommentAnime(animeID)
            const response: Record<string, any> = {
                "data": {
                    "count": results.length,
                    "items": results.map(result => {
                        return {
                            commentID: result.id,
                            review: result.comment,
                            time: result.commentTime
                        }
                    })
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
    @UseGuards(AuthGuard)
    @Get('user')
    async GetCommentUser(@Req() req: any) {
        try {
            const results: any = await this.commentService.FindCommentUser(req.user.id);
            const response: Record<string, any> = {
                "data": {
                    "count": results.length,
                    "items": results.map(result => {
                        return {
                            commentID: result.id,
                            review: result.comment,
                            time: result.commentTime
                        }
                    })
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}
