export class Migration20260707000000 {
  async up(queryRunner: any): Promise<void> {
    await queryRunner.query(`CREATE TABLE "order" ("id" character varying NOT NULL, "status" text NOT NULL, CONSTRAINT "PK_order" PRIMARY KEY ("id"))`);
  }
}
