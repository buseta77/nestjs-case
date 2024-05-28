import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  migrations: ['dist/db/migrations/*.js'],
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
};

export const dataSource = new DataSource(dataSourceOptions);
