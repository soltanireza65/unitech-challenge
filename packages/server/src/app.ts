import { authRoutes } from "@/routes/auth.routes"
import cors from '@fastify/cors'
import fastifyJWT from "@fastify/jwt"
import { FastifyInstance } from "fastify"
import { JWT_SECRET } from "./config"
import { server } from "./main"
import { categoriesRoutes } from "./routes/category.routes"
import { userRoutes } from "./routes/user.routes"
import { JWT } from "./utils/jwt.utils"
import { errorMessages } from "./constants/errorMessages"
import { StatusCodes } from "http-status-codes"


export class App {
  constructor(
    private readonly _server: FastifyInstance,
    private readonly _port: number = 8000,
    private readonly _host: string = "0.0.0.0"
  ) { }

  async start() {
    this.registerCors()

    this.registerJwt()

    this.decorate()

    this.registerSchema()

    this.registerRoutes()

    this.addHook();

    this.listen();
  }

  registerJwt() {
    this._server.register(fastifyJWT, {
      secret: JWT_SECRET,
    })
  }

  decorate() {
    this._server.decorate("authenticate", async (request: any, reply: any): Promise<any> => {
      try {
        const decoded = JWT.verify<any>(request.headers.authorization, "ACCESS_TOKEN_PUBLIC_KEY")

        if (!decoded) {
          return reply.code(StatusCodes.UNAUTHORIZED).send()
        }

        request.user = decoded
      } catch (error) {
        return reply.send(error)
      }
    })
  }


  registerCors() {
    this._server.register(cors, {})
  }

  addHook() {
    this._server.addHook("preHandler", (req, reply, next) => {
      req.jwt = server.jwt;
      return next();
    });
  }

  registerSchema() {
    //
  }

  registerRoutes() {
    this._server.register(authRoutes, { prefix: "/api/auth" });
    this._server.register(userRoutes, { prefix: "/api/users" });
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
