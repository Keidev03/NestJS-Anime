import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAnimeDTO {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    anotherName: string[];

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    genre: string[];

    @IsOptional()
    @IsNumber()
    totalEpisode: number;

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    releaseDate: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    updateAt: Date;
}