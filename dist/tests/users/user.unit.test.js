"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const mocha_1 = require("mocha");
const service_config_1 = require("../../config/service.config");
let port = service_config_1.SERVER.PORT;
const server = `${service_config_1.SERVER.URL_API_HOST}:${Math.abs(port)}/rest/v1` ||
    `localhost:8018/rest/v1`;
chai_1.default.use(chai_http_1.default);
const CHAI = chai_1.default.request(server).keepOpen();
mocha_1.describe("User", function () {
    //? ms
    this.slow(0.2 * 1000); //! 300ms, setup
    before(function () {
        // runs once before the first test in this block
    });
    after(function () {
        // runs once after the last test in this block
    });
    beforeEach(function () {
        // runs before each test in this block
    });
    afterEach(function () {
        // runs after each test in this block
    });
    // test cases
    it("TESTING", function (done) {
        CHAI.get("/").end((error, res) => {
            chai_1.expect(res).to.have.status(200);
            done();
        });
    });
});
