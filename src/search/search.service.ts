import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SearchService {
  constructor(private readonly usersService: UsersService) {}

  async search(q: string, target = 'all') {
    if (!q || !target) throw new HttpException('Query is required', 400);

    try {
      let users;
      switch (target) {
        case 'all':
          users = await this.usersService.getUsersByName(q);
          return { users };

        case 'users':
          users = await this.usersService.getUsersByName(q);
          return { users };
      }
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || 400);
    }
  }
}
