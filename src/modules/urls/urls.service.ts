import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  create(createUrlDto: CreateUrlDto) {
    return 'This action adds a new url';
  }

  findAll() {
    return `This action returns all urls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} url`;
  }

  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
