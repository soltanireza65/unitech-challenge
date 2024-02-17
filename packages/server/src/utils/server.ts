import { LOG_LEVEL } from "@/config";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";

const _server = Fastify({
    logger: {
        level: LOG_LEVEL,
        redact: ["password", "DATABASE_URL"],
        transport: {
            target: "pino-pretty",
        },
        base: {
            pid: false
        },
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
    },
});

export function getServer() {

    _server.get("/", async (request: FastifyRequest, reply: FastifyReply) => reply.code(200).send("OK"));

    ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, async () => {
            await _server.close();
            process.exit(0);
        });
    });

    return _server
}




