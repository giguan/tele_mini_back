import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { DataSource, Repository } from 'typeorm';
import { NamedJson } from './entities/NamedJson';
import dataSource from 'database.providers';
import { Match } from './entities/Match';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(NamedJson)
    private namedJsonRepository: Repository<NamedJson>,

    @InjectRepository(Match)
    private matchJsonRepository: Repository<Match>,

    private dataSource: DataSource
  ) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  async dataSort(data: any) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.getRepository(NamedJson).save({
        "data": JSON.stringify(data)
      });


      for (const gameData of data) {
        await queryRunner.manager.getRepository(Match).save({
          "data": JSON.stringify(gameData)
        });
      }

      await queryRunner.commitTransaction();


    } catch(error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();

    }

    return data;
  }

}
