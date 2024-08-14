import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common'

import { TypeService } from './type.service'
import { AuthGuard } from '../../guards/auth.guard'
import { AdminGuard } from '../../guards/admin.guard'

@Controller('type')
export class TypeController {

    constructor(private readonly TypeService: TypeService) { }

    @Post('create')
    // @UseGuards(AuthGuard, AdminGuard)
    async PostType(@Body('type') type: string) {
        try {
            if (!type) {
                throw new NotFoundException('No Type entered')
            }
            const result = await this.TypeService.CreateType(type);
            const response: Record<string, any> = {
                Message: `Create Type ${result.name} successfully`,
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Delete('delete/:id')
    // @UseGuards(AuthGuard, AdminGuard)
    async DeleteType(@Param('id') id: string) {
        try {
            await this.TypeService.DeleteType(id)
            const response: Record<string, any> = {
                Message: 'Delete successfully',
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    @Get('getall')
    async GetAllType() {
        try {
            const Type: any = await this.TypeService.FindAllType();
            const response: Record<string, any> = {
                "data": {
                    "count": Type.length,
                    "items": Type.map(Type => {
                        return {
                            id: Type.id,
                            type: Type.name
                        }
                    })
                }
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
}
