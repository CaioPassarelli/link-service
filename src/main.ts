import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger, ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function boostrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT ?? 3000
  app.enableShutdownHooks()

  const config = new DocumentBuilder()
    .setTitle('Link Service - API')
    .setDescription('API de encurtamento de URLs')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  await app.listen(port)
  logger.log(`Application is running on: http://localhost:${port}`)
  logger.log(`Swagger Docs available at: http://localhost:${port}/api`)
}
boostrap()