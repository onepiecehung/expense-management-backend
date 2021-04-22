"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_prom_bundle_1 = __importDefault(require("express-prom-bundle")); // https://www.npmjs.com/package/express-prom-bundle
const helmet_1 = __importDefault(require("helmet"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const __test___worker_1 = require("./connector/rabbitmq/__test__/__test__.worker");
const index_1 = require("./connector/rabbitmq/index");
const logger_winston_1 = __importDefault(require("./core/log/logger.winston"));
const response_json_1 = require("./core/response/response.json");
const api_version_1_0_0_routes_1 = __importDefault(require("./routes/graphql/api.version.1.0.0.routes"));
const api_version_1_0_0_routes_2 = __importDefault(require("./routes/rest/bin/api.version.1.0.0.routes"));
const metricsMiddleware = express_prom_bundle_1.default({
    buckets: [0.1, 0.4, 0.7],
    includeMethod: true,
    includePath: true,
    customLabels: { year: null },
    transformLabels: (labels) => Object.assign(labels, { year: new Date().getFullYear() }),
    metricsPath: "/metrics",
    promClient: {
        collectDefaultMetrics: {},
    },
    urlValueParser: {
        minHexLength: 5,
        extraMasks: [
            "^[0-9]+\\.[0-9]+\\.[0-9]+$", // replace dot-separated dates with #val
        ],
    },
    normalizePath: [
        ["^/foo", "/example"], // replace /foo with /example
    ],
});
// TODO: Running worker
index_1.createQueue()
    .then(() => {
    setTimeout(() => {
        __test___worker_1.testAMQP();
    }, 5000);
})
    .catch((error) => {
    console.error("Error init rabbit : ", error);
});
const app = express_1.default();
// ! This only for production
// app.use((req: Request, res: Response, next: NextFunction) => {
//     Object.assign(
//         res.locals,
//         {
//             userAgent: new UAParser(req.headers["user-agent"]),
//         },
//         {
//             ip:
//                 req.headers["x-forwarded-for"] ||
//                 req.ip ||
//                 req.ips ||
//                 req.headers["x-real-ip"],
//         },
//         { uuid: uuidv4() }
//     );
//     next();
// }, log);
/**
 * todo: https://www.npmjs.com/package/express-prom-bundle
 */
app.use(metricsMiddleware);
/**
 * todo: setup helmet
 * Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
 * Helmet is actually just a collection of smaller middleware functions that set security-related HTTP response headers:
 */
app.use(helmet_1.default());
/**
 * todo: Use gzip compression
 */
app.use(compression_1.default());
// TODO: Setup for get IP, for reverse proxy
app.set("trust proxy", true);
// TODO: set up cors
app.use(cors_1.default());
// TODO: Log to file when running on production
if (process.env.NODE_ENV === "production") {
    app.use(morgan_1.default("combined", { stream: logger_winston_1.default.stream }));
}
else {
    app.use(morgan_1.default("dev"));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
// TODO setup router
app.use("/rest", api_version_1_0_0_routes_2.default);
app.use("/graphql", api_version_1_0_0_routes_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(http_errors_1.default(404));
});
app.use((err, req, res, next) => {
    return response_json_1.responseError(req, res, err);
});
exports.default = app;
