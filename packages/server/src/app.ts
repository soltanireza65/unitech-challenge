import { FastifyInstance } from "fastify"
import { categoriesRoutes } from "./routes/category.routes"

export class App {
  constructor(
    private readonly _server: FastifyInstance,
    private readonly _port: number = 8000,
    private readonly _host: string = "0.0.0.0"
  ) { }

  async start() {
    this.registerRoutes()

    this.listen();
  }

  registerRoutes() {
    this._server.register(categoriesRoutes, { prefix: "/api/categories" });
  }

  listen() {
    try {
      this._server.listen({
        port: this._port,
        host: this._host,
      });
    } catch (error) {
      this._server.log.error(error);
      process.exit(1);
    }
  }

}
