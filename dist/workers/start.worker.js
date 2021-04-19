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
require("../connector/mongo/init/index");
const index_1 = require("../connector/rabbitmq/index");
const __test___worker_1 = require("../connector/rabbitmq/__test__/__test__.worker");
index_1.createQueue()
    .then(() => {
    setTimeout(() => {
        index_1.createWorkers(), __test___worker_1.testAMQP();
    }, 3000);
})
    .catch((error) => {
    console.log("Error init rabbit : ", error);
});
