import { AuthController } from "@/controllers/auth.controller";
import { FastifyInstance } from "fastify";

const signUpSchema = {
    body: {
        required: ['username', 'email', 'password'],
        properties: {
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
        },
    },
    response: {
        201: {
            type: "object",
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                    }
                },
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    },
}

const signInSchema = {
    body: {
        required: ['email', 'password'],
        properties: {
            email: { type: "string" },
            password: { type: "string" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        accessToken: { type: "string" },
                        refreshToken: { type: "string" },
                    }
                },
                message: { type: 'string' },
                success: { type: 'boolean' },
            },
        },
    },
}

export async function authRoutes(server: FastifyInstance) {

    // Sign Up
    server.post("/signup", { schema: signUpSchema }, AuthController.signup);

    // Sign In
    server.post("/signin", { schema: signInSchema }, AuthController.signin);

    // Get Current User
    server.get("/me", { preHandler: [server.authenticate] }, AuthController.currentUser);

    // Refresh access token with refresh token
    server.post("/refresh", AuthController.refresh);

    // Verify  user account with verification code
    server.post("/verify/:userId/:verificationCode", AuthController.verify);

    // Forgot Password request
    server.post("/password-forgot", AuthController.forggotPassword);

    // Verify Password reset code
    server.post("/password-forgot-verify", AuthController.verifyPasswordResetCode);

    // Reset Password
    server.post("/password-reset", AuthController.passwordReset);

    server.log.info("Auth routes registered")
}