import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity({tableName: 'users'})
export class User {

    @PrimaryKey()
    id: string = v4();

    @Property({length: 100})
    name: string

    @Property({length: 100})
    @Unique()
    public email: string
}
