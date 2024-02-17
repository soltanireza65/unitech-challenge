import { errorMessages } from "@/constants/errorMessages";
import { AuthService } from "@/services/auth.service";
import { Response, SignInInput, SignUpInput } from "types";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from 'http-status-codes';
import { Prisma } from "@prisma/client";


export class AuthController {
    public static async signup(
        request: FastifyRequest<{ Body: SignUpInput }>,
        reply: FastifyReply
    ) {
        const { body } = request

        try {
            const userId = await AuthService.signup(body)

            const response: Response<Prisma.UserGetPayload<{ select: { id: true } }>> = {
                data: { id: userId },
                success: true,
                message: "Email Link Preview has logged in your terminal (dev only)"
            }

            return reply.code(StatusCodes.CREATED).send(response)
        } catch (error: any) {
            if (error.message == errorMessages.alreadyExists("Email")) return reply.code(StatusCodes.CONFLICT).send(error)
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }

    public static async signin(
        request: FastifyRequest<{ Body: SignInInput }>,
        reply: FastifyReply
    ) {
        const { body } = request

        try {
            const data = await AuthService.signin(body)

            const res: Response<{ accessToken: string, refreshToken: string }> = {
                data: data,
                success: true,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }

    public static async verify(
        request: FastifyRequest<{ Params: { userId: string, verificationCode: string } }>,
        reply: FastifyReply
    ) {
        const { params } = request

        try {
            const response = await AuthService.verify(params)

            return reply.code(StatusCodes.OK).send(response)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }



    public static async currentUser(
        request: FastifyRequest<{}>,
        reply: FastifyReply
    ) {
        const { user } = request

        const res: Response<{ id: number; email: string; name: string; }> = {
            data: user,
            success: true,
            message: ""
        }

        return reply.code(StatusCodes.OK).send(res)

    }
    public static async refresh(
        request: FastifyRequest<{ Body: { refreshToken: string } }>,
        reply: FastifyReply
    ) {
        const { body } = request

        try {
            const data = await AuthService.refresh(body)

            const res: Response<{ accessToken: string }> = {
                data: data,
                success: true,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
    public static async forggotPassword(
        request: FastifyRequest<{ Body: { email: string } }>,
        reply: FastifyReply
    ) {
        const { email } = request.body

        try {
            const { success } = await AuthService.forggotPassword({ email })

            const res: Response<null> = {
                data: null,
                success: success,
                message: ""
            }
            return reply.code(StatusCodes.OK).send(res)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
    public static async verifyPasswordResetCode(
        request: FastifyRequest<{ Body: { email: string, passwordResetCode: string } }>,
        reply: FastifyReply
    ) {
        const { email, passwordResetCode } = request.body

        try {
            const { success } = await AuthService.verifyPasswordResetCode({ email, passwordResetCode })

            const res: Response<null> = {
                data: null,
                success: success,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
    public static async passwordReset(
        request: FastifyRequest<{ Body: { email: string, password: string, passwordResetCode: string } }>,
        reply: FastifyReply
    ) {
        const { email, password, passwordResetCode } = request.body

        try {
            const { success } = await AuthService.passwordReset({ email, password, passwordResetCode })

            const res: Response<null> = {
                data: null,
                success: success,
                message: ""
            }

            return reply.code(StatusCodes.OK).send(res)
        } catch (error) {
            return reply.code(StatusCodes.BAD_REQUEST).send(error)
        }
    }
}
