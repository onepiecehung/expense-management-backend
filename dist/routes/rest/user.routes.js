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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController = __importStar(require("../../controllers/user.controller"));
const auth_jwt_middleware_1 = require("../../middleware/jwt/auth.jwt.middleware");
const user_validation_1 = require("../../validator/user.validation");
const router = express_1.Router();
router.route("/login").post(user_validation_1.LoginValidator, UserController.login);
router.route("/register").post(user_validation_1.RegisterValidator, UserController.register);
router.route("/getProfile").get(auth_jwt_middleware_1.Authentication, UserController.getProfile);
router
    .route("/getAccessToken")
    .post(auth_jwt_middleware_1.AuthorizationRefreshToken, UserController.getAccessToken);
router.route("/logout").post(auth_jwt_middleware_1.Authentication, UserController.logout);
router
    .route("/changePassword")
    .put(user_validation_1.ChangePasswordValidator, auth_jwt_middleware_1.Authentication, UserController.changePassword);
exports.default = router;
