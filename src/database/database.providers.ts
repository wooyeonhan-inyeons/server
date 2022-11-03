import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mariadb',
        host: `${process.env.DB_URL}`,
        port: Number(process.env.DB_PORT),
        username: `${process.env.DB_USER}`,
        password: `${process.env.DB_PASSWORD}`,
        database: `${process.env.DB_NAME}`,
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];