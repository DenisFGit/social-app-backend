import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1772718859228 implements MigrationInterface {
    name = 'InitialMigration1772718859228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isAdmin" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isAdmin" DROP DEFAULT`);
    }

}
