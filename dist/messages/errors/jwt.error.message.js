"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH = exports.JWT_MESSAGE = void 0;
exports.JWT_MESSAGE = {
    JWT_GENERATE_ERROR: process.env.JWT_GENERATE_ERROR || `Can't generate token`,
};
exports.AUTH = {
    TOKEN_EXPIRED_OR_IS_UNAVAILABLE: process.env.TOKEN_EXPIRED_OR_IS_UNAVAILABLE ||
        `Token has expired or is unavailable`,
    TOKEN_EXPIRED: process.env.TOKEN_EXPIRED || `Token has expired`,
};
