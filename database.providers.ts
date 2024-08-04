import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { NamedJson } from 'src/entities/NamedJson';
import { Match } from 'src/entities/Match';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'named',
    entities: [
      NamedJson,
      Match
    ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;
