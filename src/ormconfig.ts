import { DataSource } from 'typeorm';
import { User } from './users/users.entity';
import { Exhibit } from './exhibits/exhibits.entity';
import { Comment } from './comments/comments.entity';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'museum_user',
  password: 'password',
  database: 'museum_db',
  entities: [User, Exhibit, Comment],
  migrations: ['migrations/*.ts'],
  synchronize: true,
});