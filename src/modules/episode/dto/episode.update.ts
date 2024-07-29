import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEpisodeDTO {

    @IsOptional()
    @IsString()
    animeID: string;

    @IsOptional()
    @IsNumber()
    episode: number;

    @IsOptional()
    @IsNumber()
    duration: number;

    @IsOptional()
    @IsDateString()
    releaseDate: Date;

    @IsOptional()
    @IsString()
    serverDrive: string

    @IsOptional()
    @IsString()
    serverHydrax: string

    @IsOptional()
    @IsString()
    serverHelvid: string

    @IsOptional()
    @IsString()
    serverDaily: string
}