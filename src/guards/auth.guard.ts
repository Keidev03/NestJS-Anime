import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly secrect;

    constructor(private jwtService: JwtService) {
        this.secrect = process.env.SECRECT;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new UnauthorizedException();
            }
            const payload = await this.jwtService.verifyAsync(token, { secret: this.secrect });
            request['user'] = payload;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}