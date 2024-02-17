import { errorMessages } from "@/constants/errorMessages";
import { server } from "@/main";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

export class UserService {

    public static create(payload: Prisma.UserCreateInput) {
        return prisma.user.create({ data: payload })
    }

    public static async findAll() {
        try {
            return prisma.user.findMany();
        } catch (error) {
            server.log.error(error)
            return []
        }
    }

    public static async findOneById(id: number) {
        try {
            const user = await prisma.user.findUnique({ where: { id } })

            if (!user) throw new Error(errorMessages.notFound("User"))

            return user
        } catch (error) {
            server.log.error(error)
            return null
        }
    }
    public static async findOneByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } })

            if (!user) throw new Error(errorMessages.notFound("User"))

            return user
        } catch (error) {
            server.log.error(error)
            return null
        }
    }

    public static async verify({ userId, verificationCode }: { userId: string, verificationCode: string }): Promise<any> {
        try {
            const user = await this.findOneById(+userId)

            if (!user || user.verificationCode != verificationCode) throw new Error(errorMessages.invalidCredentials)

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    verified: true,
                    verificationCode: null
                }
            })

            return {
                success: true
            }
        } catch (error) {
            server.log.error(error)
            return {
                success: false
            }
        }
    }

    public static async update(userId: number, payload: Partial<Prisma.UserUpdateInput>) {
        try {
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    ...payload
                }
            })

            return {
                success: true
            }
        } catch (error) {
            server.log.error(error)
            return {
                success: false
            }
        }
    }
}
