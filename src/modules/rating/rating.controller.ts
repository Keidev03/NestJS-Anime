import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('rating')
export class RatingController {

    constructor(private readonly ratingService: RatingService) { }

    @UseGuards(AuthGuard)
    @Post('create/:animeID')
    async PostRating(@Req() req: any, @Param('animeID') animeID: string, @Body('rating') rating: number) {
        await this.ratingService.CreateRating(req.user.id, animeID, rating);
        const response: Record<string, any> = {
            Message: "Create successfully",
        }
        return response;
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:animeID')
    async DeleteRating(@Req() req: any, @Param('animeID') animeID: string) {
        await this.ratingService.DeleteRating(req.user.id, animeID);
        const response: Record<string, any> = {
            Message: "Delete successfully",
        }
        return response;
    }

    @Get('anime/:animeID')
    async GetAllRatingAnime(@Param('animeID') animeID: string) {
        const result = await this.ratingService.FindAllRatingAnime(animeID);
        return result;
    }
}
