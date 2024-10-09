import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly AuthService: AuthService;
  constructor( AuthService: AuthService) {
    this.AuthService = AuthService;
  }
  async use(req: any, res: any, next: any) {
    const { status } = res;
    const { headers } = req;
    await this.AuthService.getAuth(req, headers);
    next();
  }
}
