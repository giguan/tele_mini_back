import { Injectable } from '@nestjs/common';
import { CreateTeleUserDto } from './dto/createTeleUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        
        @InjectRepository(Users)
        private teleUserRepository: Repository<Users>,

        private dataSource : DataSource
    ) {

    }

    async telUserInfo(telUserId: string) {

        const returned = await this.teleUserRepository
                .findOne({
                    where: { teleId: telUserId },
                    select: ['id', 'teleId', 'firstName', 'lastName', 'money']
                })

        return returned;

    }

    async userCheck(body: CreateTeleUserDto) {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction();

        let returned;

        try {

            returned = await queryRunner.manager
                .getRepository(Users)
                .findOne({ where: { teleId: body.user_id } });

            console.log("returned : ",returned)

            if(!returned) {
                await queryRunner.manager.getRepository(Users).save({
                    "teleId": body.user_id,
                    "firstName": body.first_name,
                    "lastName": body.last_name,
                    "money": 10000
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

    return returned;

    }
}
