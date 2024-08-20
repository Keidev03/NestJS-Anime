import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'

import { GenreService } from './genre.service'
import { AuthGuard } from '../../guards/auth.guard'
import { AdminGuard } from '../../guards/admin.guard'

@Controller('genre')
@UseGuards(AuthGuard, AdminGuard)
export class GenreController {

    constructor(private readonly genreService: GenreService) { }

    @Post('create')
    async PostGenre(@Body('genre') genre: string) {
        try {
            if (!genre) {
                throw new NotFoundException('No genre entered')
            }
            const result = await this.genreService.CreateGenre(genre)
            const response: Record<string, any> = {
                Message: `Create genre ${result.name} successfully`,
            }
            return response
        } catch (error) {
            throw error
        }
    }

    @Delete('delete/:id')
    async DeleteGenre(@Param('id') id: string) {
        try {
            await this.genreService.DeleteGenre(id)
            const response: Record<string, any> = {
                Message: 'Delete successfully',
            }
            return response
        } catch (error) {
            throw error
        }
    }

    @Get('getall')
    async GetAllGenre() {
        try {
            const genre: any = await this.genreService.FindAllGenre();
            const response: Record<string, any> = {
                "data": {
                    "count": genre.length,
                    "items": genre.map(genre => {
                        return {
                            id: genre.id,
                            category: genre.name
                        }
                    })
                }
            }
            return response
        } catch (error) {
            throw error
        }
    }
}
