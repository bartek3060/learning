import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePurchases1795648327294 implements MigrationInterface {
    name = 'CreatePurchases1795648327294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "idempotency_keys" ("key" character varying(255) NOT NULL, "requestHash" text NOT NULL, "response" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "statusCode" integer, CONSTRAINT "PK_0afd83cbf08c9d12089a9bffc5e" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "amountCents" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "idempotencyKey" character varying(255) NOT NULL, "eventId" uuid NOT NULL, CONSTRAINT "UQ_3ec9a3d209a224a4ca804486045" UNIQUE ("idempotencyKey"), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_550b7fc9227dbf1d2d4066db30d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_550b7fc9227dbf1d2d4066db30d"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TABLE "idempotency_keys"`);
    }

}
