import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAt1771958251503 implements MigrationInterface {
    name = 'AddCreatedAt1771958251503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exhibit" ADD "createdAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exhibit" DROP COLUMN "createdAt"`);
    }

}
