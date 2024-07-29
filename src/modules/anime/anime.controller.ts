import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { CreateAnimeDTO, PaginationAnimeDTO, UpdateAnimeDTO } from './dto';
import { AnimeService } from './anime.service';
import { IAnime } from './anime.schema';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('anime')
export class AnimeController {

    // private readonly url: string;

    constructor(private readonly animeService: AnimeService) {
        // this.url = process.env.URL
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
            const result: IAnime = await this.animeService.CreateAnime({...data}, poster, background);
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
    @UseGuards(AuthGuard, AdminGuard)
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
    @UseGuards(AuthGuard, AdminGuard)
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
    async GetAllAnime(@Query() query: PaginationAnimeDTO, @Request() request: any) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 20;
            const movies = await this.animeService.FindAllAnime(page, limit);
            const respone: Record<string, any> = {
                "Count": movies.length,
                "data": movies.map(movie => {
                    return {
                        id: movie.id,
                        title: movie.title,
                        anotherName: movie.anotherName,
                        description: movie.description,
                        genres: movie.genres,
                        totalEpisode: movie.totalEpisode,
                        namePart: movie.namePart,
                        releaseDate: movie.releaseDate,
                        updateAt: movie.updateAt,
                        imagePoster: `https://drive.google.com/thumbnail?id=${movie.imagePoster}&sz=s1000`,
                        imageBackground: `https://drive.google.com/thumbnail?id=${movie.imageBackground}&sz=s1000`
                    }
                })
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
            const response: Record<string, any> = {
                "data": {
                    id: result.id,
                    title: result.title,
                    anotherName: result.anotherName,
                    description: result.description,
                    genres: result.genres,
                    totalEpisode: result.totalEpisode,
                    namePart: result.namePart,
                    releaseDate: result.releaseDate,
                    updateAt: result.updateAt,
                    imagePoster: `https://drive.google.com/thumbnail?id=${result.imagePoster}&sz=s1000`,
                    imageBackground: `https://drive.google.com/thumbnail?id=${result.imageBackground}&sz=s1000`
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Get('search')
    async GetSearchAnime(@Query() query: any) {
        try {
            const results = await this.animeService.SearchAnime(query.query);
            const response = {
                "count": results.length,
                "data": results.map(anime => {
                    return {
                        title: anime.title,
                        image: `https://drive.google.com/uc?export=view&id=${anime.imagePoster}`
                    }
                })
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}