"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dotEnvConfigs = {
    path: path_1.default.resolve(process.cwd(), ".env"),
};
dotenv_1.default.config(dotEnvConfigs);
require("./server");
require("../connector/redis/index");
require("../connector/mongo/init/index");
// import "../connector/socket.io/init";
// import "../connector/socket.io/__test__/__test__.socket.io-client";
