import { Migrator } from '@mikro-orm/migrations';
import { Options } from '@mikro-orm/mysql';

const config: Options = {
    entities: ['./dist/**/entities/*.entity.js'],
    entitiesTs: ['./src/**/entities/*.entity.ts'],
    dbName: process.env.MIKRO_ORM_DB_NAME,
    host: process.env.MIKRO_ORM_HOST,
    port: Number(process.env.MIKRO_ORM_PORT),
    user: process.env.MIKRO_ORM_USER,
    password: process.env.MIKRO_ORM_PASSWORD,
    migrations: {
        tableName: 'mikro_orm_migrations',
        path: './dist/migrations',
        pathTs: './src/migrations',
        glob: '!(*.d).{js,ts}',
        allOrNothing: true,
        emit: 'ts'
    },
    debug: true,
    extensions: [Migrator]
}

export default config;