import { App } from "@/app";
import { HOST, PORT } from '@/config'
import { getServer } from "@/utils/server";


export const server = getServer()

async function main() {
    const app = new App(server, +PORT, HOST);
    await app.start();
}

main();