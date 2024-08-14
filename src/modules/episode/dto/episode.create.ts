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
    @IsString()
    releaseDate: Date;

    @IsOptional()
    @IsString()
    server1: string

    @IsOptional()
    @IsString()
    server2: string

    @IsOptional()
    @IsString()
    server3: string

    @IsOptional()
    @IsString()
    server4: string
}