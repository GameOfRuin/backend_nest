import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from './entities';

export const connectToPostgresql = async () => {
  const sequelize = new Sequelize({
    host: 'localhost',
    database: 'backend',
    username: 'postgres',
    password: 'postgrespassword',
    port: 5455,
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.info('Successfully connected to PostgreSQL');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:');
    console.error(error);
    throw error;
  }

  sequelize.addModels([UserEntity]);

  await sequelize.sync({ alter: true });
};
