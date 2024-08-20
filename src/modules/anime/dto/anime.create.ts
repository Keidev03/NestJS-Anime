import { Transform } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateAnimeDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    genre: number[];

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    releaseDate: Date;

    // Optional--------------------------
    @IsOptional()
    @IsArray()
    anotherName: string[];

    @IsOptional()
    @IsNumberString()
    totalEpisode: number;

    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => new Date(value))
    updateAt: Date;
}