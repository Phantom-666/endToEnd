import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './db/dto/CreateUser.dto';
import { DbService } from './db/db.service';
import { UserDto } from './db/dto/User.dto';
import { checkToken } from './utils';

@Injectable()
export class AppService {
  constructor(private readonly dbService: DbService) {}

  async register(body: CreateUserDto) {
    const user = await this.dbService.register(body);

    return { status: 'Success', user };
  }

  async login(body: UserDto) {
    const options = await this.dbService.login(body, process.env.SECRET_PHRASE);

    return options;
  }

  async getChats(token: string, users: string[]) {
    const status = await checkToken(token, process.env.SECRET_PHRASE);
    if (!status) throw new BadRequestException('Invalid token');

    const chats = await this.dbService.getChats(users);

    return { chats };
  }

  async getAllUsers(token: string) {
    const status = await checkToken(token, process.env.SECRET_PHRASE);
    if (!status) throw new BadRequestException('Invalid token');

    const users = await this.dbService.getAllUsers();

    return { users };
  }

  async getCorrespondence(token: string, id: string) {
    const status = await checkToken(token, process.env.SECRET_PHRASE);
    if (!status) throw new BadRequestException('Invalid token');

    const result = await this.dbService.getCorrespondence(id);

    return result;
  }

  async getPublicKey(token: string, id: string) {
    const status = await checkToken(token, process.env.SECRET_PHRASE);
    if (!status) throw new BadRequestException('Invalid token');

    return await this.dbService.getPublicKey(id);
  }

  async setPublicKey(token: string, publicKey: string) {
    const status = await checkToken(token, process.env.SECRET_PHRASE);
    if (!status) throw new BadRequestException('Invalid token');

    return await this.dbService.setPublicKey(publicKey, (status as any).id);
  }
}
