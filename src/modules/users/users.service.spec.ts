import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve criar um usuário com senha hash', async () => {
    const createUserDto = { name: 'Test', email: 'test@test.com', password: '123' };
    
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ ...createUserDto, id: '1', password: 'hashed_password' });
    jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('salt'));
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed_password'));

    const result = await service.create(createUserDto);

    expect(result).toHaveProperty('id');
    expect(result).not.toHaveProperty('password');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('deve lançar erro se o e-mail já existir', async () => {
    const createUserDto = { name: 'Test', email: 'exist@test.com', password: '123' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'exist@test.com' });

    await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
  });
});