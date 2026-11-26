import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentId1795650997761 implements MigrationInterface {
    name = 'AddPaymentId1795650997761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ADD "paymentId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "UQ_35280601a9e3f54cb4b1e483bfa" UNIQUE ("paymentId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "UQ_35280601a9e3f54cb4b1e483bfa"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "paymentId"`);
    }

}
