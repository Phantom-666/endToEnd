import { Body, Controller, Headers, Post, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './db/dto/CreateUser.dto';
import { UserDto } from './db/dto/User.dto';
import { UsersDto } from './db/dto/Users.dto';
import { PublicKeyDto } from './db/dto/PublicKey.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.appService.register(body);
  }

  @Post('checkPassword')
  async login(@Body() body: UserDto) {
    return await this.appService.login(body);
  }

  @Post('chats')
  async getChats(@Headers('token') token: string, @Body() body: UsersDto) {
    const res = await this.appService.getChats(token, body.users);

    return res;
  }

  @Get('allusers')
  async getAllUsers(@Headers('token') token: string) {
    return await this.appService.getAllUsers(token);
  }

  @Get('/correspondence/:id')
  async getCorrespondence(
    @Headers('token') token: string,
    @Param('id') id: string,
  ) {
    return await this.appService.getCorrespondence(token, id);
  }

  @Get('/getpublickey/:id')
  async getPublicKey(@Param('id') id: string, @Headers('token') token: string) {
    return await this.appService.getPublicKey(token, id);
  }

  @Post('setpublickey')
  async setPublicKey(
    @Headers('token') token: string,
    @Body() body: PublicKeyDto,
  ) {
    return await this.appService.setPublicKey(token, body.publicKey);
  }
}
