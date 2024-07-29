import { IsNumber, IsNumberString, IsOptional } from "class-validator";

export class PaginationAnimeDTO {

    @IsOptional()
    @IsNumberString()
    page: number;

    @IsOptional()
    @IsNumberString()
    limit: number;
}