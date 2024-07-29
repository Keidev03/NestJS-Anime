import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const user = request.user; // Đảm bảo rằng request.user đã được đặt trong quá trình xác thực
            if (!user) {
                throw new UnauthorizedException();
            }
            if (user.status !== true) {
                throw new UnauthorizedException();
            }
            request['user'] = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}