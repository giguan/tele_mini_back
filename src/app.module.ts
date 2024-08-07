import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Favorites } from './entities/Favorites';
import { Games } from './entities/Games';
import { Leagues } from './entities/Leagues';
import { Periods } from './entities/Periods';
import { Users } from './entities/Users';
import { Teams } from './entities/Teams';
import { GamesModule } from './games/games.module';
import { NamedModule } from './named/named.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'mini',
      autoLoadEntities: true,
      entities: [
        Favorites,
        Games,
        Leagues,
        Periods,
        Teams,
        Users
      ],
      keepConnectionAlive: true,
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4_general_ci',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    GamesModule,
    NamedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
