export const enum ENVS {
  DEV = 'DEV',
  TEST = 'TEST',
  PROD = 'PROD',
}

const getEnv = (type: string) =>
  (type === 'TEST' && ENVS.TEST) || (type === 'PROD' && ENVS.PROD) || ENVS.DEV;

export const App = {
  PORT: Number(process.env.PORT) || 3000,
  ENV: getEnv(process.env.NODE_ENV || ''),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
