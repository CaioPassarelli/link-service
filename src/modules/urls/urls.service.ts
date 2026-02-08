import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  async shorten(createUrlDto: CreateUrlDto, userId?: string) {
    const baseUrl = process.env.BASE_DOMAIN || 'http://localhost:3000'
    let code: string
    let isUnique = false
    let attempts = 0

    while (!isUnique && attempts < 5) {
      code = nanoid(6)

      const existing = await this.prisma.url.findUnique({
        where: { code }
      })

      if (!existing) {
        isUnique = true
      }

      attempts++
    }

    if (!isUnique) {
      throw new BadRequestException('Erro ao gerar código único. Tente novamente.')
    }

    const url = await this.prisma.url.create({
      data: {
        originalUrl: createUrlDto.originalUrl,
        code,
        userId: userId || null
      }
    })

    return {
      code: url.code,
      short_url: `${baseUrl}/${url.code}`,
      original_url: url.originalUrl
    }
  }

  async findOneByCode(code: string) {
    const url = await this.prisma.url.findFirst({
      where: {
        code,
        deletedAt: null
      }
    })

    if (!url) {
      throw new NotFoundException('URL não encontrada ou expirada.')
    }

    await this.prisma.url.update({
      where: { id: url.id },
      data: { clicks: { increment: 1 } }
    })

    return url
  }

  async findAllByUserId(userId: string) {
    return this.prisma.url.findMany({
      where: {
        userId,
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async update(id: string, updateUrlDto: UpdateUrlDto, userId: string) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    })

    if (!url) {
      throw new NotFoundException('URL não encontrada.')
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar essa URL.')
    }

    return this.prisma.url.update({
      where: { id },
      data: {
        originalUrl: updateUrlDto.originalUrl,
        updatedAt: new Date()
      }
    })
  }

  async remove(id: string, userId: string) {
    const url = await this.prisma.url.findUnique({
      where: { id }
    })

    if (!url) {
      throw new NotFoundException('URL não encontrada.')
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para excluir essa URL.')
    }

    return this.prisma.url.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })
  }
}
