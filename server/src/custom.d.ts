/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    SESSION_SECRET: string;
    SERVER_PORT?: string;
  }
}
