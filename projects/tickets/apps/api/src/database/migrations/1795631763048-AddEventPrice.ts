import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventPrice1795631763048 implements MigrationInterface {
  name = 'AddEventPrice1795631763048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD "priceCents" integer`);
    await queryRunner.query(`UPDATE "events" SET "priceCents" = 14900`);
    await queryRunner.query(
      `ALTER TABLE "events" ALTER COLUMN "priceCents" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "priceCents"`);
  }
}
