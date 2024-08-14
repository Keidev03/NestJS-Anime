import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'

import { GenresService } from './genres.service'
import { AuthGuard } from '../../guards/auth.guard'
import { AdminGuard } from '../../guards/admin.guard'

@Controller('genres')
export class GenresController {

    constructor(private readonly genresSerice: GenresService) { }

    @Post('create')
    // @UseGuards(AuthGuard, AdminGuard)
    async PostGenres(@Body('genres') genres: string) {
        try {
            if (!genres) {
                throw new NotFoundException('No genres entered')
            }
            const result = await this.genresSerice.CreateGenres(genres);
            const response: Record<string, any> = {
                Message: `Create genres ${result.name} successfully`,
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Delete('delete/:id')
    // @UseGuards(AuthGuard, AdminGuard)
    async DeleteGenres(@Param('id') id: string) {
        try {
            await this.genresSerice.DeleteGenres(id)
            const response: Record<string, any> = {
                Message: 'Delete successfully',
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Get('getall')
    async GetAllGenres() {
        try {
            const genres: any = await this.genresSerice.FindAllGenres();
            const response: Record<string, any> = {
                "data": {
                    "count": genres.length,
                    "items": genres.map(genres => {
                        return {
                            id: genres.id,
                            category: genres.name
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
