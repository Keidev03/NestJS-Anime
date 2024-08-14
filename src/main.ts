import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ErrorMiddleware } from './middleware/error.middleware'

async function Bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new ErrorMiddleware())
  app.enableCors()
  // Cấu hình CORS
  // app.enableCors({
  //   origin: 'http://localhost:5173', // Cho phép yêu cầu từ origin cụ thể
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
  //   credentials: true, // Cho phép cookies và credentials
  //   allowedHeaders: 'Content-Type, Accept, Authorization', // Các headers được phép
  // });
  await app.listen(3000)
}
Bootstrap()
