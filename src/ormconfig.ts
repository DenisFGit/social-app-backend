import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './users/users.entity';
import { Exhibit } from './exhibits/exhibits.entity';
import { Comment } from './comments/comments.entity';

config(); // loads .env file

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Exhibit, Comment],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});