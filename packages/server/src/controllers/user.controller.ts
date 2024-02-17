import { UserService } from "@/services/user.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

export class UserController {
    public static async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const users = await UserService.findAll()

            return reply.code(StatusCodes.OK).send(users)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
}
