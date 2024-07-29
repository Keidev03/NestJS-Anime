import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDTO, UpdateEpisodeDTO } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('episode')
export class EpisodeController {

    constructor(private readonly episodeService: EpisodeService) { }

    @Post('create')
    @UseGuards(AuthGuard, AdminGuard)
    async PostEpisode(@Body() data: CreateEpisodeDTO) {
        try {
            await this.episodeService.CreateEpisode(data);
            const response: Record<string, any> = {
                Message: "Create episode successfully",
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Post('csv')
    @UseGuards(AuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('csv'))
    async PostEpisodeCSV(@UploadedFile() file: Express.Multer.File) {
        try {
            const result = await this.episodeService.CreateManyEpisode(file);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @Patch('update/:id')
    @UseGuards(AuthGuard, AdminGuard)
    async UpdateEpisode(@Param('id') id: string, @Body() data: UpdateEpisodeDTO) {
        try {
            await this.episodeService.UpdateEpisode(id, data);
            const response: Record<string, any> = {
                Message: 'Update successfully',
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard, AdminGuard)
    async DeleteEpisode(@Param('id') id: string) {
        try {
            await this.episodeService.DeleteEpisode(id);
            const response: Record<string, any> = {
                Message: 'Delete successfully',
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Get('getall/:id')
    async GetAllEpisodeAnime(@Param('id') animeID: string) {
        try {
            const episodes = await this.episodeService.FindAllEpisodeAnime(animeID);
            const response: Record<string, any> = {
                "Count": episodes.length,
                "data": episodes.map(episode => {
                    return {
                        id: episode.id,
                        animeID: episode.animeID,
                        episode: episode.episode,
                        duration: episode.duration,
                        releaseDate: episode.releaseDate,
                        server: [episode.serverDrive, episode.serverHelvid, episode.serverHydrax, episode.serverDaily]
                    }
                })
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Get('getone/:id')
    async GetOneEpisodeAnime(@Param('id') animeID: string, @Query('episode') episode: string) {
        try {
            const result = await this.episodeService.FindOneEpisodeAnime(animeID, episode);
            const response: Record<string, any> = {
                "data": {
                    id: result.id,
                    animeID: result.animeID,
                    episode: result.episode,
                    duration: result.duration,
                    releaseDate: result.releaseDate,
                    server: [result.serverDrive, result.serverHelvid, result.serverHydrax, result.serverDaily]
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}
