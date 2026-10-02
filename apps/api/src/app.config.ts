export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl?: string;
}

function parsePort(value: string | undefined): number {
  if (!value) return 3001;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }
  return port;
}

export const appConfig: Readonly<AppConfig> = Object.freeze({
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL,
});
