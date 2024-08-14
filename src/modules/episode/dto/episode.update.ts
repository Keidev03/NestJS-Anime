import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEpisodeDTO {

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