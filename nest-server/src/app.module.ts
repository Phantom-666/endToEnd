import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketGateway } from './socket/socket.gateway';
import { ConfigModule } from '@nestjs/config';

// TODO: handle Errors

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    MongooseModule.forRoot(
      'mongodb+srv://166vadimlukanov166:REj6GUGAc9Cdr5PL@cluster0.4wudzj8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
