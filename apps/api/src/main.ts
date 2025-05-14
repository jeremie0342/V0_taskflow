import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import helmet from "helmet"
import { PrismaService } from "@task-management/prisma"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Middleware de sécurité
  app.use(helmet())
  app.use(cookieParser())

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
  })

  // Validation des DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle("Task Management API")
    .setDescription("API pour la gestion de tâches et de projets")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  // Prisma shutdown hook
  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  // Démarrage du serveur
  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
}

bootstrap()
