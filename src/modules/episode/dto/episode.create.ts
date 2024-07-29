import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEpisodeDTO {

    @IsNotEmpty()
    @IsString()
    animeID: string;

    @IsNotEmpty()
    @IsNumber()
    episode: number;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @IsNotEmpty()
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