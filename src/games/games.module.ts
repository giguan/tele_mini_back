import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { Teams } from 'src/entities/Teams';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Games,
      Teams,
    ])
  ],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}
