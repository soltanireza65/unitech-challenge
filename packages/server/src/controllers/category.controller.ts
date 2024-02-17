import { errorMessages } from "@/constants/errorMessages";
import { server } from "@/main";
import { CategoryService } from "@/services/category.service";
import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Response } from "types";


export class CategoryController {
    public static async create(
        request: FastifyRequest<{ Body: Prisma.CategoryCreateInput }>,
        reply: FastifyReply
    ) {
        const { category, counter, latitude, longitude } = request.body

        try {
            const data = await CategoryService.create({
                category,
                counter,
                ...(latitude && { latitude: +latitude }),
                ...(longitude && { longitude: +longitude }),
            })

            const res: Response<Prisma.CategoryGetPayload<{}>> = {
                data: data,
                success: true,
                message: ""
            }

            return reply.code(StatusCodes.CREATED).send(res)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }

    public static async getAll(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const data = await CategoryService.findAll()

            const res: Response<Prisma.CategoryGetPayload<{}>[]> = {
                data: data,
                success: true,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
    public static async getById(
        request: FastifyRequest<{ Params: { id: string, }, }>,
        reply: FastifyReply
    ) {
        try {
            const data = await CategoryService.findOneById(+request.params.id)

            const res: Response<Prisma.CategoryGetPayload<{}>> = {
                data: data,
                success: true,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error: any) {
            if (error.message == errorMessages.notFound("Category")) return reply.code(StatusCodes.NOT_FOUND).send(error)
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }

    public static async incrementCounter(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const data = await CategoryService.incrementCounterByOne(+request.params.id)

            const res: Response<Prisma.CategoryGetPayload<{ select: { counter: true } }>> = {
                data: data,
                success: true,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error: any) {
            if (error.message == errorMessages.notFound("Category")) return reply.code(StatusCodes.NOT_FOUND).send(error)
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
    public static async decrementCounter(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const data = await CategoryService.decrementCounterByOne(+request.params.id)

            const res: Response<Prisma.CategoryGetPayload<{ select: { counter: true } }>> = {
                data: data,
                success: true,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error: any) {
            if (error.message == errorMessages.notFound("Category")) return reply.code(StatusCodes.NOT_FOUND).send(error)
            if (error.message == errorMessages.scoreCannotBeNegative) return reply.code(StatusCodes.BAD_REQUEST).send(error)

            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
}
