import { IsNumberString, IsOptional, IsString } from "class-validator";

export class FindAnimeDTO {

    @IsOptional()
    @IsNumberString()
    page: number;

    @IsOptional()
    @IsNumberString()
    limit: number;

    @IsOptional()
    @IsString()
    genre: string;

    @IsOptional()
    @IsString()
    type: string;
}