import { DataSource } from 'typeorm';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';

export async function seedAdmin(dataSource: DataSource) {

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.warn('ADMIN_USERNAME или ADMIN_PASSWORD не заданы в .env — пропускаем seed');
        return;
    }

    const userRepo = dataSource.getRepository(User);

    const existing = await userRepo.findOne({ where: { isAdmin: true } });
    if (existing) return;

    // сначала хешируем пароль
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    // потом передаём готовую строку в create
    const admin = userRepo.create({
        username: process.env.ADMIN_USERNAME!,
        password: hashedPassword,
        isAdmin: true,
    });

    await userRepo.save(admin);
    console.log('Admin created');
}