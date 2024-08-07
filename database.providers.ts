import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Games } from 'src/entities/Games';
import { Leagues } from 'src/entities/Leagues';
import { Periods } from 'src/entities/Periods';
import { Teams } from 'src/entities/Teams';
import { Users } from 'src/entities/Users';
import { Favorites } from 'src/entities/Favorites';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'mini',
    entities: [
        Favorites,
        Games,
        Leagues,
        Periods,
        Teams,
        Users
    ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;
