import { Migration } from '@mikro-orm/migrations';

export class Migration20211204105725 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "contribution" add column "url" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "contribution" drop column "url";');
  }
}
