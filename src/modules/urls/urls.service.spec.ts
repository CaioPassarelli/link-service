import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UrlsService', () => {
  let service: UrlsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    url: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve encurtar uma URL', async () => {
    // Mock: findUnique retorna null (código disponível)
    (prisma.url.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.url.create as jest.Mock).mockImplementation((args) => ({
      id: '1',
      ...args.data,
      createdAt: new Date(),
    }));

    const result = await service.shorten({ originalUrl: 'http://google.com' }, 'user1');
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('short_url');
  });

  it('deve encontrar URL pelo código e incrementar cliques', async () => {
    const url = { id: '1', code: 'abc', originalUrl: 'http://google.com' };
    (prisma.url.findFirst as jest.Mock).mockResolvedValue(url);
    (prisma.url.update as jest.Mock).mockResolvedValue(url);

    const result = await service.findOneByCode('abc');
    expect(result).toEqual(url);
    expect(prisma.url.update).toHaveBeenCalled();
  });

  it('deve lançar NotFound se URL não existir', async () => {
    (prisma.url.findFirst as jest.Mock).mockResolvedValue(null);
    await expect(service.findOneByCode('invalid')).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar URL se for o dono', async () => {
    const url = { id: '1', userId: 'user1' };
    (prisma.url.findUnique as jest.Mock).mockResolvedValue(url);
    (prisma.url.update as jest.Mock).mockResolvedValue({ ...url, originalUrl: 'new' });

    await service.update('1', { originalUrl: 'new' }, 'user1');
    expect(prisma.url.update).toHaveBeenCalled();
  });

  it('deve lançar Forbidden ao tentar editar URL de outro', async () => {
    const url = { id: '1', userId: 'user1' };
    (prisma.url.findUnique as jest.Mock).mockResolvedValue(url);

    await expect(service.update('1', { originalUrl: 'new' }, 'user2')).rejects.toThrow(ForbiddenException);
  });

  it('deve fazer soft delete se for o dono', async () => {
    const url = { id: '1', userId: 'user1' };
    (prisma.url.findUnique as jest.Mock).mockResolvedValue(url);

    await service.remove('1', 'user1');
    expect(prisma.url.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ deletedAt: expect.any(Date) })
    }));
  });
});