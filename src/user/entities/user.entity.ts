import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity({tableName: 'users'})
export class User {

    @PrimaryKey()
    id: string

    @Property({length: 100})
    name: string

    @Property({length: 100})
    @Unique()
    public email: string
}
