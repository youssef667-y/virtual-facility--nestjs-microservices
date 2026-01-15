import { Injectable } from '@nestjs/common';

@Injectable()
export class AlarmClassifierServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
