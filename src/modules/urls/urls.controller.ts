import { Controller, Get, Post, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { Response } from 'express';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @Body() createUrlDto: CreateUrlDto, 
    @Req() req
  ) {
    const userId = req.user?.id
    return this.urlsService.shorten(createUrlDto, userId)
  }

  @Get(':code')
  async redirect(
    @Param('code') code: string, 
    @Res() res: Response) {
      const url = await this.urlsService.findOneByCode(code)

      return res.redirect(url.originalUrl)
    }
}
