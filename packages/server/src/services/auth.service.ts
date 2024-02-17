import { server } from "@/main"
import { SignInInput, SignUpInput } from "types"
import { hashPassword, verifyPassword } from "@/utils/hash.util"
import { Mailer } from "@/utils/mailer"
import prisma from "@/utils/prisma"
import * as fastifyJwt from "@fastify/jwt"
import { UserService } from "./user.service"
import { APP_URL } from "@/config"
import { errorMessages } from "@/constants/errorMessages"
import { randomUUID } from "crypto"
import { JWT } from "@/utils/jwt.utils"
import { SessionService } from "./sesssion.service"



export class AuthService {

    public static async signup(payload: SignUpInput) {

        const { password, ...rest } = payload

        const { hash, salt } = hashPassword(payload.password)
        try {
            const user = await UserService.create({ ...rest, salt, password: hash })

            const verificationPayload = {
                id: user.id,
                verificationCode: user.verificationCode
            }

            await Mailer.sendEmail({
                from: "0Ug1I@example.com",
                to: user.email,
                subject: "Welcome to My App",
                text: `
                    Please verify your account using: 
                    
                    ${JSON.stringify(verificationPayload, null, 2)}
                    
                    POST ${APP_URL}/auth/verify/${user.id}/${user.verificationCode}
                    `,
            })

            return user.id

        } catch (error: any) {
            if (error.code === "P2002") {
                throw new Error(errorMessages.alreadyExists("Email")) // 409 Conflict
            }
            throw error
        }

    }

    public static async signin(payload: SignInInput) {
        try {

            const user = await UserService.findOneByEmail(payload.email)

            if (!user) throw new Error(errorMessages.invalidCredentials) // no need to inform users which users are in our DB

            if (!user.verified) throw new Error(errorMessages.userNotVerified)

            const passwordVerified = verifyPassword({ candidatePassword: payload.password, hash: user.password, salt: user.salt })

            if (!passwordVerified) throw new Error(errorMessages.invalidCredentials)

            const { password, salt, passwordResetCode, verificationCode, ...rest } = user

            const session = await SessionService.create(user.id)

            const accessToken = JWT.sign(rest, "ACCESS_TOKEN_PRIVATE_KEY", { expiresIn: "1h" });
            const refreshToken = JWT.sign({ sessionId: session.id }, "REFRESH_PRIVATE_KEY", { expiresIn: "30d" });

            return { accessToken, refreshToken }
        } catch (error) {
            throw error
        }
    }

    public static async refresh(payload: { refreshToken: string }) {
        try {
            const decoded = JWT.verify<{ sessionId: number }>(payload.refreshToken, "REFRESH_PUBLIC_KEY")
            if (!decoded) throw new Error(errorMessages.invalidCredentials)

            const session = await SessionService.findOneById(decoded.sessionId)

            if (!session || !session.valid) throw new Error(errorMessages.invalidCredentials)

            const user = await UserService.findOneById(session.userId)

            if (!user) throw new Error(errorMessages.invalidCredentials)

            const { password, salt, passwordResetCode, verificationCode, ...rest } = user

            const accessToken = JWT.sign(rest, "ACCESS_TOKEN_PRIVATE_KEY", { expiresIn: "1h" });

            return { accessToken }
        } catch (error) {
            throw error
        }
    }

    public static async verify({ userId, verificationCode }: { userId: string, verificationCode: string }): Promise<any> {
        try {
            await UserService.verify({ userId, verificationCode });

            return {
                success: true
            }

        } catch (error) {
            throw error
        }
    }

    public static async forggotPassword(payload: { email: string }) {
        try {
            const user = await UserService.findOneByEmail(payload.email)

            if (!user) throw new Error(errorMessages.invalidCredentials)

            if (!user.verified) throw new Error(errorMessages.userNotVerified)

            const passwordResetCode = randomUUID()

            await UserService.update(user.id, { passwordResetCode: passwordResetCode })

            await Mailer.sendEmail({
                from: "0Ug1I@example.com",
                to: user.email,
                subject: "Password Reset",
                text: `Your password reset code is ${passwordResetCode}`
            })

            return {
                success: true
            }
        } catch (error) {
            throw error
        }
    }

    public static async verifyPasswordResetCode(payload: { email: string, passwordResetCode: string }){
        try {
            const user = await UserService.findOneByEmail(payload.email)

            if (!user || user.passwordResetCode != payload.passwordResetCode) {
                throw new Error(errorMessages.invalidCredentials)
            }

            return {
                success: true
            }
        } catch (error) {
            throw error
        }
    }
    public static async passwordReset(payload: { email: string, password: string, passwordResetCode: string }) {
        try {
            const user = await UserService.findOneByEmail(payload.email)
            if (!user || user.passwordResetCode != payload.passwordResetCode) {
                throw new Error(errorMessages.invalidCredentials)
            }

            const { hash, salt } = hashPassword(payload.password)

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hash,
                    salt,
                    passwordResetCode: null
                }
            })

            return {
                success: true
            }
        } catch (error) {
            throw error
        }

    }
}


