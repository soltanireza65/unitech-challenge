import { Prisma } from "@prisma/client";

export type Response<T> = {
    data: T,
    message?: string,
    success: boolean
}


export type SignUpInput = Omit<Prisma.UserCreateInput, 'passwordResetCode' | 'verificationCode' | 'verified' | 'salt' | 'session'>
export type SignInInput = Omit<Prisma.UserCreateInput, 'passwordResetCode' | 'verificationCode' | 'verified' | 'salt' | 'lastName' | 'firstName' | 'username' | 'session'>
