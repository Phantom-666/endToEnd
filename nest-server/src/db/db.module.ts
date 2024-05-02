import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schemas/user.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [DbController],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
