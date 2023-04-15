import { getEnvOrFail } from '@utils/env';

/*
This configuration object defines the necessary parameters for connecting to a PostgreSQL database,
including the user, password, database name, host, and port. These values are retrieved from environment
variables using the getEnvOrFail function, which throws an error if the variable is not defined. This
configuration can be used by an application to establish a connection to the database and perform queries.
*/
export const config = {
  db: {
    user: getEnvOrFail('POSTGRES_USER'),
    password: getEnvOrFail('POSTGRES_PASSWORD'),
    database: getEnvOrFail('POSTGRES_DB'),
    host: getEnvOrFail('POSTGRES_HOST'),
    port: getEnvOrFail('POSTGRES_PORT')
  }
};
