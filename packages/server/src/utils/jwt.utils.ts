import { ACCESS_TOKEN_PRIVATE_KEY, ACCESS_TOKEN_PUBLIC_KEY, REFRESH_PRIVATE_KEY, REFRESH_PUBLIC_KEY } from "@/config";
import { server } from "@/main";
import { SignOptions } from "@fastify/jwt";

export class JWT {
    public static sign(
        object: Object,
        keyName: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_PRIVATE_KEY",
        options?: Partial<SignOptions>
    ) {

        const key = Buffer.from(
            keyName === "REFRESH_PRIVATE_KEY"
                ? REFRESH_PRIVATE_KEY
                : ACCESS_TOKEN_PRIVATE_KEY,
            "base64"
        ).toString("ascii");

        return server.jwt.sign(object, {
            key,
            algorithm: "RS256",
            ...(options && options),
        });
    }

    public static verify<T>(token: string, keyName: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_PUBLIC_KEY"): T | null {

        const key = Buffer.from(
            keyName === "REFRESH_PUBLIC_KEY"
                ? REFRESH_PUBLIC_KEY
                : ACCESS_TOKEN_PUBLIC_KEY,
            "base64"
        ).toString("ascii");
        
        try {
            const decoded = server.jwt.verify(token.split(" ")[1], { key }) as T
            return decoded
        } catch (error) {
            return null
        }
    }
}
