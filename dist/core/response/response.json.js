"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseWSError = exports.responseWSSuccess = exports.responseError = exports.responseSuccess = void 0;
/**
 *
 * @param {Response} res
 * @param {Object} data
 * @param {number} statusCode
 * @param {number} statusCodeResponse
 */
async function responseSuccess(res, data, statusCode, statusCodeResponse) {
    const dataResponse = {
        success: true,
        statusCode: res?.statusCode
            ? res?.statusCode
            : statusCode
                ? statusCode
                : data?.statusCode
                    ? data?.statusCode
                    : 200,
        statusMessage: res?.statusMessage ? res?.statusMessage : `successful`,
        statusCodeResponse: data?.statusCodeResponse
            ? data?.statusCodeResponse
            : statusCodeResponse || 10000,
        data: data?.statusCodeResponse ? deleteElement(data) : data,
    };
    // if (process.env.NODE_ENV === `development`) {
    //     logger.info(dataResponse);
    // }
    return res?.status(dataResponse.statusCode).json(dataResponse);
}
exports.responseSuccess = responseSuccess;
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Object} error
 * @param {number} statusCode
 * @param {number} statusCodeResponse
 */
async function responseError(req, res, error, statusCode, statusCodeResponse) {
    const dataResponse = {
        success: false,
        statusCode: error?.statusCode
            ? error?.statusCode
            : statusCode
                ? statusCode
                : 500,
        statusMessage: error?.statusMessage ? error?.statusMessage : `failure`,
        statusCodeResponse: statusCodeResponse || error?.statusCodeResponse || 50000,
        data: {
            errorMessage: typeof error === "string" ? error : error?.message || `bruh...`,
            request: req?.originalUrl,
            method: req?.method,
        },
    };
    // if (process.env.NODE_ENV === `development`) {
    //     logger.info(dataResponse);
    // }
    return res?.status(dataResponse.statusCode).json(dataResponse);
}
exports.responseError = responseError;
function deleteElement(object, element) {
    delete object[`${element}`];
    delete object?.statusCode;
    delete object?.statusCodeResponse;
    return object;
}
function responseWSSuccess(data, statusCode, statusMessage = "successful", statusCodeResponse = 10000) {
    const dataResponse = {
        success: true,
        statusCode: statusCode
            ? statusCode
            : data?.statusCode
                ? data?.statusCode
                : 200,
        statusMessage: statusMessage,
        statusCodeResponse: statusCodeResponse,
        data: data,
    };
    return dataResponse;
}
exports.responseWSSuccess = responseWSSuccess;
function responseWSError(data, statusCode, statusMessage = "failure", statusCodeResponse = 50000) {
    const dataResponse = {
        success: false,
        statusCode: statusCode
            ? statusCode
            : data?.statusCode
                ? data?.statusCode
                : 500,
        statusMessage: statusMessage,
        statusCodeResponse: statusCodeResponse,
        data: data,
    };
    return dataResponse;
}
exports.responseWSError = responseWSError;
