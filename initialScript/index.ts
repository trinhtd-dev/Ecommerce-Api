import { ConfigService } from '@nestjs/config';
import { HashingService } from '../shared/hashing.service';
import { PrismaService } from '../shared/prisma.service';
import { RoleName } from '../shared/constants/role.constant';

const configService = new ConfigService();

const prisma = new PrismaService();
const hashingService = new HashingService();
const main = async () => {
  const roleCount = await prisma.role.count();
  if (roleCount > 0) {
    throw new Error('Roles already exist');
  }
  const roles = await prisma.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin role',
      },
      {
        name: RoleName.Client,
        description: 'Client role',
      },
      {
        name: RoleName.Seller,
        description: 'Seller role',
      },
    ],
  });

  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
    },
  });
  const hashedPassword = await hashingService.hash(configService.get<string>('ADMIN_PASSWORD')!);
  const adminUser = await prisma.user.create({
    data: {
      email: configService.get<string>('ADMIN_EMAIL')!,
      password: hashedPassword,
      name: configService.get<string>('ADMIN_NAME')!,
      phoneNumber: configService.get<string>('ADMIN_PHONE_NUMBER')!,
      roleId: adminRole.id,
    },
  });
  return {
    createdRoleCount: roles.count,
    adminUser,
  };
};

main()
  .then(({ adminUser, createdRoleCount }) => {
    console.log(`Created ${createdRoleCount} roles`);
    console.log(`Created admin user: ${adminUser.email}`);
  })
  .catch(console.error);

export default main;