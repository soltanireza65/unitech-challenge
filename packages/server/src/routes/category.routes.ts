import { CategoryController } from "@/controllers/category.controller";
import prisma from "@/utils/prisma";
import { FastifyInstance } from "fastify";


const commonProperties = {
    latitude: { type: "string" },
    longitude: { type: "string" },
    category: { type: "string" },
    counter: { type: "number" },
}


const singleCategoryProperties = {
    data: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            ...commonProperties
        }
    },
    message: { type: 'string' },
    success: { type: 'boolean' },
}

const createCategorySchema = {
    body: {
        properties: { ...commonProperties },
    },
    response: {
        201: {
            type: "object",
            properties: {
                ...singleCategoryProperties
            },
        },
    },
}

const getCategoriesSchema = {
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            ...commonProperties
                        }
                    },
                },
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    },
}
const getCategorySchema = {
    response: {
        200: {
            type: "object",
            properties: {
                ...singleCategoryProperties
            },
        },
    },
}

const incrementDecrementCounterSchema = {
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        counter: { type: 'number' },
                    }
                },
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    },
}

export async function categoriesRoutes(server: FastifyInstance) {

    // Create Category
    server.post("/", { schema: createCategorySchema }, CategoryController.create);

    // Get All Categories
    server.get("/", { schema: getCategoriesSchema }, CategoryController.getAll);

    // Get Category By Id
    server.get("/:id", { schema: getCategorySchema }, CategoryController.getById);

    // Update Category Score | Increment
    server.patch("/:id/count/increment", { schema: incrementDecrementCounterSchema }, CategoryController.incrementCounter);

    // Update Category Score | Decrement
    server.patch("/:id/count/decrement", { schema: incrementDecrementCounterSchema }, CategoryController.decrementCounter);


    // Delete All Categories
    server.delete("/", async () => prisma.category.deleteMany());

    server.log.info("Category routes registered")
}