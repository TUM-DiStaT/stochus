import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getData(userId: string): { message: string } {
    return { message: `Welcome to backend, ${userId}!` }
  }
}
