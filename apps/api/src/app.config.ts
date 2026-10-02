const parsedPort = Number.parseInt(process.env.PORT ?? '3000', 10);

export const appConfig = {
  port: Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000,
};
