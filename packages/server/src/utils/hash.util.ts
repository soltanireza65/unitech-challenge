import { randomBytes, pbkdf2Sync } from "crypto";

interface IVerifyPasswordArgs {
    candidatePassword: string;
    salt: string;
    hash: string;
}
export function hashPassword(password: string) {

    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    return { hash, salt };
}

export function verifyPassword({ candidatePassword, salt, hash }: IVerifyPasswordArgs) {
    const candidateHash = pbkdf2Sync(candidatePassword, salt, 1000, 64, "sha512").toString("hex");
    console.log("🚀 ~ verifyPassword ~ candidateHash:", candidateHash)

    return candidateHash === hash;
}