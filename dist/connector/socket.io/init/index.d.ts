import { RedisClient } from "redis";
import { Namespace, Server, Socket } from "socket.io";
declare type TNamespace = {
    test: string;
    user: string;
};
declare class SocketIO {
    server: Server | undefined;
    socket: Socket | any;
    names: TNamespace;
    namespace: Namespace;
    io: any;
    pubClient: RedisClient;
    subClient: RedisClient;
    constructor();
    getPubClient(): RedisClient;
    getSubClient(): RedisClient;
    subEvent(eventName: string): void;
    pubEvent(eventName: string, data: any): void;
    setMiddleware(callback: any): void;
    getNamespace(namespace?: string): Namespace | any;
    getSocket(listenName?: string): Socket;
    onListenEvent(eventName: string, callback: any): void;
    emitEvent(eventName: string, data: JSON | Object): void;
    broadcastEmitEvent(eventName: string, data: JSON | Object): void;
}
declare const _default: SocketIO;
export default _default;
