import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

const sharedProviders = [PrismaService];

@Global()
@Module({
  providers: sharedProviders,
  exports: sharedProviders,
})
export class SharedModule {}
