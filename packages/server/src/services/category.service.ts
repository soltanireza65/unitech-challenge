import { errorMessages } from "@/constants/errorMessages"
import prisma from "@/utils/prisma"
import { Prisma } from "@prisma/client"

export class CategoryService {


    public static create(payload: Prisma.CategoryCreateInput) {
        return prisma.category.create({ data: payload })
    }

    public static findAll() {
        return prisma.category.findMany()
    }

    public static async findOneById(id: number) {
        const category = await prisma.category.findUnique({ where: { id } })

        if (!category) throw new Error(errorMessages.notFound("Category"))

        return category
    }

    public static async incrementCounterByOne(id: number,) {
        const category = await this.findOneById(id)

        if (!category) throw new Error(errorMessages.notFound("Category"))

        const updated = await prisma.category.update({
            where: {
                id
            },
            data: {
                counter: {
                    increment: 1,
                }
            }
        })

        return { counter: updated.counter }
    }
    public static async decrementCounterByOne(id: number,) {
        const category = await this.findOneById(id)

        if (!category) throw new Error(errorMessages.notFound("Category"))

        const currentCounter = category.counter ?? 0

        if (currentCounter <= 0) throw new Error(errorMessages.scoreCannotBeNegative)

        const updated = await prisma.category.update({
            where: {
                id
            },
            data: {
                counter: {
                    decrement: 1,
                }
            }
        })

        return { counter: updated.counter }
    }
}


