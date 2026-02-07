import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger, ValidationPipe } from "@nestjs/common"

async function boostrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  const port = process.env.PORT ?? 3000

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  await app.listen(port)
  logger.log(`Application is running on: http://localhost:${port}`)
}
boostrap()