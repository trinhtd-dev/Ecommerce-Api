import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HashingService } from './hashing.service';

const sharedProviders = [PrismaService, HashingService];

@Global()
@Module({
  providers: sharedProviders,
  exports: sharedProviders,
})
export class SharedModule {}
