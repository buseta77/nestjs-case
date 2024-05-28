import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1716892994578 implements MigrationInterface {
  name = 'CreateTables1716892994578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "password" VARCHAR NOT NULL,
        "balance" INTEGER NOT NULL DEFAULT 100
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "order" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "productName" VARCHAR NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" INTEGER NOT NULL,
        "isCompleted" BOOLEAN NOT NULL DEFAULT 0,
        "userId" INTEGER,
        CONSTRAINT "fk_user_order" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
