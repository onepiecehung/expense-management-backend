"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
const email_config_1 = require("../../../config/email.config");
const logger_mixed_1 = require("../../../core/log/logger.mixed");
async function sendMail(to, subject, html, attachments) {
    try {
        const transporter = nodemailer_1.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: email_config_1.NODEMAILER.EMAIL,
                pass: email_config_1.NODEMAILER.PASS,
            },
        });
        const options = {
            to: to,
            subject: subject,
            html: html,
        };
        if (attachments) {
            Object.assign(options, { attachments: attachments });
        }
        await transporter.sendMail(options, (error, info) => {
            if (error) {
                logger_mixed_1.logger.error(error);
                return false;
            }
            else {
                logger_mixed_1.logger.info(`Email sent: `, info.response);
                return true;
            }
        });
        return false;
    }
    catch (error) {
        logger_mixed_1.logger.error(error);
        return false;
    }
}
exports.sendMail = sendMail;
