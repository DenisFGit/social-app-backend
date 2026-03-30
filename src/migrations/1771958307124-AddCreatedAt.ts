import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAt1771958307124 implements MigrationInterface {
    name = 'AddCreatedAt1771958307124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exhibit" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exhibit" DROP COLUMN "createdAt"`);
    }

}
