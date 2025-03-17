import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742143485860 implements MigrationInterface {
    name = 'Migration1742143485860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ajouter l'extension uuid-ossp si elle n'existe pas
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "isActive" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        // Ne pas supprimer l'extension uuid-ossp car elle pourrait être utilisée par d'autres tables
    }
}
