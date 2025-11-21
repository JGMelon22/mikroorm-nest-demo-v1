import { Migration } from '@mikro-orm/migrations';

export class Migration20251121005539 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`users\` (\`id\` varchar(255) not null, \`name\` varchar(100) not null, \`email\` varchar(100) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`users\` add unique \`users_email_unique\`(\`email\`);`);

    this.addSql(`drop table if exists \`user\`;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table \`user\` (\`id\` varchar(255) not null, \`name\` varchar(100) not null, \`email\` varchar(100) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add unique \`user_email_unique\`(\`email\`);`);

    this.addSql(`drop table if exists \`users\`;`);
  }

}
