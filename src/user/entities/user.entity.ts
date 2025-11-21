import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

@Entity({ tableName: 'users' })
export class User {
  @ApiProperty({ description: 'User ID', example: 'uuid' })
  @PrimaryKey()
  id: string = v4();

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @Property({ length: 100 })
  name: string;

  @ApiProperty({ description: 'User email address', example: 'john@example.com' })
  @Property({ length: 100 })
  @Unique()
  email: string;
}
