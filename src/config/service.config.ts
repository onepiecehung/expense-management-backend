export const SERVER = {
    PORT: process.env.PORT || `4263`,
    URL_API_HOST: process.env.URL_API_HOST || `http://127.0.0.1`,
    DOCS_PATH: process.env.DOCS_PATH || `documents`,
    WS_PORT: process.env.WS_PORT || `7523`,
};

export const MONGO = {
    DB_URL: process.env.DB_URL || `mongodb://localhost:27017/typescript`,
};

export const REDIS = {
    REDIS_URL: process.env.REDIS_URL || `redis://127.0.0.1:6379/4`,
};
