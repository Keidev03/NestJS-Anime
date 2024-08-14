import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

import { CreateAnimeDTO, FindAnimeDTO, SearchAnimeDTO, UpdateAnimeDTO } from './dto'
import { AnimeService } from './anime.service'
import { IAnime } from './anime.schema'
import { AuthGuard } from '../../guards/auth.guard'
import { AdminGuard } from '../../guards/admin.guard'
import config from '../../config'

@Controller('anime')
export class AnimeController {

    private readonly url: string;

    constructor(private readonly animeService: AnimeService) {
        this.url = config.env.BaseURL
    };

    @Post('create')
    // @UseGuards(AuthGuard, AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'poster', maxCount: 1 },
        { name: 'background', maxCount: 1 },
    ]))
    async PostAnime(@Body() data: CreateAnimeDTO, @UploadedFiles() files: { poster: Express.Multer.File, background: Express.Multer.File }) {
        try {
            let poster = null;
            let background = null;
            if (files?.poster) {
                poster = files.poster[0];
            }
            if (files?.background) {
                background = files?.background[0];
            }
            // Start on eviroment node
            // const result: IAnime = await this.animeService.CreateAnime({ ...data }, poster, background);
            const result: IAnime = await this.animeService.CreateAnime(data, poster, background);
            const response: Record<string, any> = {
                Message: `Create Anime ${result.title} successfully`
            }

            return response;
        }
        catch (error) {
            throw error
        }
    }

    @Patch('update/:id')
    // @UseGuards(AuthGuard, AdminGuard)
    @HttpCode(HttpStatus.ACCEPTED)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'poster', maxCount: 1 },
        { name: 'background', maxCount: 1 },
    ]))
    async PatchAnime(@Param('id') id: string, @UploadedFiles() files: { poster?: Express.Multer.File[], background?: Express.Multer.File[] }, @Body() data?: UpdateAnimeDTO) {
        try {
            let poster = null;
            let background = null;
            if (files?.poster) {
                poster = files.poster[0];
            }
            if (files?.background) {
                background = files?.background[0];
            }
            // Start on eviroment node
            // await this.animeService.UpdateAnime(id, {...data}, poster, background);
            await this.animeService.UpdateAnime(id, data, poster, background);
            const response: Record<string, any> = {
                Message: "Patch successfully"
            }
            return response;
        } catch (error) {
            throw error
        }
    };

    @Delete('delete/:id')
    // @UseGuards(AuthGuard, AdminGuard)
    @HttpCode(HttpStatus.ACCEPTED)
    async DeleteAnime(@Param('id') id: string) {
        try {
            await this.animeService.DeleteAnime(id);
            const response: Record<string, any> = {
                Message: "Delete successfully"
            }
            return response;
        } catch (error) {
            throw error
        }
    }

    @Get('getall')
    @HttpCode(HttpStatus.OK)
    async GetAllAnime(@Query() query: FindAnimeDTO, @Request() request: any) {
        try {
            const page = query.page
            const limit = query.limit

            const genres = query.genres ? query.genres.split(',') : undefined
            const type = query.type || undefined

            const result = await this.animeService.FindAllAnime(genres, type, page, limit);
            const { movies, currentPage, totalPages, totalRecords } = result;
            const respone: Record<string, any> = {
                "data": {
                    "total_records": totalRecords,
                    "total_pages": totalPages,
                    "page": currentPage,
                    "count": movies.length,
                    "items": movies.map(movie => {
                        return {
                            id: movie.id,
                            title: movie.title,
                            description: movie.description,
                            imagePoster: `https://drive.google.com/thumbnail?id=${movie.imagePoster}&sz=s500`,
                            imageBackground: `https://drive.google.com/thumbnail?id=${movie.imageBackground}&sz=s1000`
                        }
                    })
                }
            }
            return respone
        } catch (error) {
            throw error
        }
    }

    @Get('getone/:id')
    @HttpCode(HttpStatus.OK)
    async GetOneAnime(@Param('id') id: string) {
        try {
            const result: IAnime = await this.animeService.FindOneAnime(id);
            const allGenres: any = result.genres;

            const response: Record<string, any> = {
                "data": {
                    id: result.id,
                    title: result.title,
                    description: result.description,
                    anotherName: result.anotherName,
                    genres: allGenres.map(genre => {
                        return genre.name
                    }),
                    totalEpisode: result.totalEpisode,
                    type: result.type.name,
                    releaseDate: result.releaseDate,
                    updateAt: result.updateAt,
                    imagePoster: `https://drive.google.com/thumbnail?id=${result.imagePoster}&sz=s500`,
                    imageBackground: `https://drive.google.com/thumbnail?id=${result.imageBackground}&sz=s1000`
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Get('search')
    async GetSearchAnime(@Query() query: SearchAnimeDTO) {
        try {
            const page = query.page
            const limit = query.limit
            const keyword = query.keyword
            const genres = query.genres ? query.genres.split(',') : undefined
            const type = query.type || undefined
            const results = await this.animeService.SearchAnime(keyword, genres, type, page, limit);
            const response = {
                "data": {
                    "count": results.length,
                    "items": results.map(anime => {
                        return {
                            id: anime.id,
                            title: anime.title,
                            imagePoster: `https://drive.google.com/thumbnail?id=${anime.imagePoster}&sz=s500`,
                            imageBackground: `https://drive.google.com/thumbnail?id=${anime.imageBackground}&sz=s1000`
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