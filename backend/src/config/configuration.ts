export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  databasePath: process.env.DATABASE_PATH ?? './data/amazon-simulator.sqlite',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-nao-use-em-producao',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
});
