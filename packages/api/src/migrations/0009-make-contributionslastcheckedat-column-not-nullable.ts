import { Migration } from '@mikro-orm/migrations';

export class Migration20211204104712 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_contributionsLastCheckedAt_check";');
    this.addSql('alter table "user" alter column "contributionsLastCheckedAt" type timestamp using ("contributionsLastCheckedAt"::timestamp);');
    this.addSql('alter table "user" alter column "contributionsLastCheckedAt" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_contributionsLastCheckedAt_check";');
    this.addSql('alter table "user" alter column "contributionsLastCheckedAt" type timestamp using ("contributionsLastCheckedAt"::timestamp);');
    this.addSql('alter table "user" alter column "contributionsLastCheckedAt" drop not null;');
  }
}
