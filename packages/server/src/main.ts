import { App } from "@/app";
import { HOST, PORT } from "@/config";
import { getServer } from "@/utils/server";
import { JWT } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }

  interface FastifyInstance {
    // authenticate: (request: FastifyRequest<{ Headers: { authorization: string } }>, reply: FastifyReply) => void
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

export const server = getServer();

async function main() {
  const app = new App(server, +PORT, HOST);
  await app.start();
}

main();
