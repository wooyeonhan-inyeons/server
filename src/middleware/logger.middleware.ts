import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    Logger.log(`${req.ip} ${req.url} ${req.method}`);
    if (!(Object.keys(req.body).length === 0)) Logger.log(req.body);
    next();
  }
}
