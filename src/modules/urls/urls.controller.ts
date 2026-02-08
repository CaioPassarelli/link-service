import { Controller, Delete, Get, Patch, Post, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUrlDto } from './dto/update-url.dto';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('urls/my-urls')
  findAllByUserId(@Req() req) {
    return this.urlsService.findAllByUserId(req.user.id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('urls/:id')
  update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req,
  ) {
    return this.urlsService.update(id, updateUrlDto, req.user.id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('urls/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.urlsService.remove(id, req.user.id)
  }

  @Get(':code')
  async redirect(
    @Param('code') code: string, 
    @Res() res: Response) {
      const url = await this.urlsService.findOneByCode(code)

      return res.redirect(url.originalUrl)
  }
}
