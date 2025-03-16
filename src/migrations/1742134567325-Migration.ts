import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742134567325 implements MigrationInterface {
    name = 'Migration1742134567325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "company" character varying NOT NULL, "position" character varying NOT NULL, "status" "public"."job_status_enum" NOT NULL DEFAULT 'TO_APPLY', "salaryExpectation" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "job"`);
    }

}
