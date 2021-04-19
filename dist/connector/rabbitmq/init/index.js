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
const amqp = __importStar(require("amqplib"));
const rabbit_config_1 = require("../../../config/rabbit.config");
const logger_mixed_1 = require("../../../core/log/logger.mixed");
class RABBIT {
    constructor() {
        this.channel = null;
        this.queues = {};
        this.subscriptions = {};
    }
    initChannel() {
        return new Promise((resolve, reject) => {
            let channel = this.channel;
            if (channel) {
                return resolve(channel);
            }
            //! Connect to RabbitMQ
            amqp.connect(rabbit_config_1.RABBIT_URL, {
                timeout: 30000,
            })
                .then(async (conn) => {
                // Create channel
                logger_mixed_1.logger.trace(`Successfully connected to: ${rabbit_config_1.RABBIT_URL}`);
                channel = await conn.createChannel();
                this.channel = channel;
                return resolve(channel);
            })
                .catch((error) => {
                logger_mixed_1.logger.error("AMQP connection failed, please check it carefully:");
                logger_mixed_1.logger.error(error);
                return reject(error);
            });
        });
    }
    getChannel() {
        return this.channel;
    }
    initQueue(queueName, durable) {
        let channel;
        try {
            channel = this.getChannel();
        }
        catch (error) {
            logger_mixed_1.logger.error("initQueue error: ", error);
            throw error;
        }
        if (!this.queues[queueName]) {
            this.queues[queueName] = channel?.assertQueue(queueName, {
                durable: durable,
            });
        }
        return this.queues[queueName];
    }
    initExchange(subscriptionName, durable) {
        let channel;
        try {
            channel = this.getChannel();
        }
        catch (error) {
            logger_mixed_1.logger.error("initExchange error: ", error);
            throw error;
        }
        if (!this.subscriptions[subscriptionName]) {
            this.subscriptions[subscriptionName] = channel?.assertExchange(subscriptionName, "fanout", {
                durable: durable,
            });
        }
        return this.subscriptions[subscriptionName];
    }
    // TODO: Work Queues, Distributing tasks among workers (the competing consumers pattern)
    async sendDataToRabbit(queueName, data) {
        if (!data || !(typeof data === "object" || typeof data === "string")) {
            throw Error("Data must be object or string");
        }
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        try {
            // Convert data to Binary type before send it to Queue
            if (!this.channel) {
                await this.initChannel();
            }
            return this.channel?.sendToQueue(queueName, Buffer.from(data), {
                persistent: true,
            });
        }
        catch (error) {
            // Do your stuff to handle this error
            logger_mixed_1.logger.error("sendDataToRabbit error:");
            logger_mixed_1.logger.error(error);
            throw error;
        }
    }
    /**
     *
     * @param queueName
     * @param callback
     * @param options
     * @param options.noAck, if need to make sure the message proceed let set noAck = false
     */
    consumeData(queueName, callback, options) {
        class settings {
            constructor() {
                this.options = options;
                this.noAck = (options && options.noAck) || false;
            }
        }
        let setting = new settings();
        if (!queueName) {
            throw new Error("You must implement queueName in consumer child");
        }
        this.channel?.consume(queueName, (msg) => {
            callback(msg, this.channel);
        }, {
            noAck: setting.noAck,
        });
    }
    // TODO: Publish/Subscribe , Sending messages to many consumers at once
    async publishToRabbit(subscriptionName, data) {
        if (!data || !(typeof data === "object" || typeof data === "string")) {
            throw Error("Data must be object or string");
        }
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        try {
            // Convert data to Binary type before send it to Queue
            if (!this.channel) {
                await this.initChannel();
            }
            return this.channel?.publish(subscriptionName, Buffer.from(data), {
                persistent: true,
            });
        }
        catch (error) {
            // Do your stuff to handle this error
            logger_mixed_1.logger.error("publishToRabbit error:");
            logger_mixed_1.logger.error(error);
            throw error;
        }
    }
    subscribe(subscriptionName, callback, options) {
        class settings {
            constructor() {
                this.options = options;
                this.noAck = (options && options.noAck) || false;
            }
        }
        let setting = new settings();
        if (!subscriptionName) {
            throw new Error("You must implement queueName in consumer child");
        }
        const _this = this;
        this.channel?.assertQueue("", {
            exclusive: true,
        }, (error, q) => {
            if (error) {
                throw new Error(error);
            }
            _this.channel?.bindQueue(q.queue, subscriptionName, "");
            _this.channel?.consume(subscriptionName, (msg) => {
                callback(msg, _this.channel);
            }, {
                noAck: setting.noAck,
            });
        });
    }
}
exports.default = new RABBIT();
