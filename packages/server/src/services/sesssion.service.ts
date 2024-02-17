import prisma from "@/utils/prisma";

export class SessionService {
    public static async create(userId: number) {
        const session = await prisma.session.create({ data: { userId } })
        return session
    }
    public static async findOneById(sessionId: number) {
        const session = await prisma.session.findUnique({
            where: {
                id: sessionId
            },
            include: {
                user: true
            }
        })

        return session
    }
}