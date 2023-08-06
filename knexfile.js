module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "expense_tracker",
      user: "admin_bey",
      password: "sunucugeny55",
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
};
