import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/user.model';
import { CreateUserDto } from './dto/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/User.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class DbService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.userModel.create({
        name: createUserDto.name,
        login: createUserDto.login,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  async login(userDto: UserDto, phrase: string) {
    const user = await this.userModel.findOne({ login: userDto.login });

    if (!user) throw new NotFoundException('No such user');

    const hashStatus = await bcrypt.compare(userDto.password, user.password);

    if (!hashStatus) throw new NotFoundException('Invalid password');

    const token = sign({ id: user.id }, phrase);
    const options = {
      token,
      id: user.id,
      logUser: user.name,
      image: user.image,
    };

    return options;
  }

  async getChats(users: string[]) {
    const result = [];

    for (let i = 0; i < users.length; i++) {
      const user = await this.userModel.findById(users[i]);

      if (user) {
        result.push(user.name);
      }
    }

    return result;
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async getCorrespondence(id: string) {
    const isPartner = await this.userModel.findById(id);

    if (!isPartner) throw new NotFoundException('No such user');
    return { name: isPartner.name, image: isPartner.image };
  }

  async getPublicKey(id: string) {
    const isParther = await this.userModel.findById(id);
    if (!isParther) throw new NotFoundException('No such user');
    return { publicKey: isParther.publicKey };
  }

  async setPublicKey(publicKey: string, id: string) {
    const user = await this.userModel.findById(id);

    user.publicKey = JSON.stringify(publicKey);
    await user.save();
  }
}
