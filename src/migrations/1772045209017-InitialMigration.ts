import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1772045209017 implements MigrationInterface {
    name = 'InitialMigration1772045209017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "exhibitId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c3ccea5d3778b018c3ba010d96c" FOREIGN KEY ("exhibitId") REFERENCES "exhibit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c3ccea5d3778b018c3ba010d96c"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
