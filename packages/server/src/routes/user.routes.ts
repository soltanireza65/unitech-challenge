import { UserController } from "@/controllers/user.controller";
import prisma from "@/utils/prisma";
import { FastifyInstance } from "fastify";


export async function userRoutes(server: FastifyInstance) {

    // Get All Users
    server.get("/", { preHandler: [server.authenticate] }, UserController.getAll);

    // Delete All Users
    server.delete("/", { preHandler: [server.authenticate] }, async () => prisma.user.deleteMany());

    server.log.info("User routes registered")
}