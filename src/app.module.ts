import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from 'shared/config/environment-var-validator.config';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 3. Giúp ConfigModule có sẵn ở mọi nơi
      envFilePath: '.env', // 4. Chỉ định đường dẫn file .env
      validate: validateEnv, // 5. Giao "bản quy tắc" để kiểm tra
      cache: true, // 6. Tăng tốc độ truy cập biến môi trường
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
