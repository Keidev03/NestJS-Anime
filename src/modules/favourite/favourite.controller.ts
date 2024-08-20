import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'

import { FavouriteService } from './favourite.service'
import { AuthGuard } from '../../guards/auth.guard'
import { FindAnimeDTO } from '../anime/dto'

@Controller('favourite')
@UseGuards(AuthGuard)
export class FavouriteController {
    constructor(private readonly favouriteService: FavouriteService) { }

    @Post('create/:animeID')
    async PostAnimeFavourite(@Req() req: any, @Param('animeID') animeID: Array<string>) {
        try {
            await this.favouriteService.AddAnimeFavourite(req.user.id, animeID)
            const response: Record<string, any> = {
                Message: "Create successfully",
            }
            return response
        } catch (error) {
            throw error
        }
    }

    @Delete('delete/:animeID')
    async DeleteAnimeFavourite(@Req() req: any, @Param('animeID') animeID: string) {
        try {
            await this.favouriteService.DeleteAnimeFavourite(req.user.id, animeID)
            const response: Record<string, any> = {
                Message: "Delete successfully",
            }
            return response
        } catch (error) {
            throw error
        }
    }

    @Get('getall')
    async GetAllFavourite(@Req() req: any, @Query() query: FindAnimeDTO) {
        try {
            const result = await this.favouriteService.FindAllFavourite(req.user.id, query.page, query.limit)
            const response: Record<string, any> = {
                "data": {
                    "count": result.length,
                    "items": result.map(anime => {
                        return {
                            anime: anime.animeID
                        }
                    })
                }
            }
            return result
        } catch (error) {
            throw error
        }
    }
}
