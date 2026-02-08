import { Controller, Delete, Get, Patch, Post, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUrlDto } from './dto/update-url.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('URLs')
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encurtar uma URL (uso do token de autenticação é opcional.' })
  @ApiResponse({ status: 201, description: 'URL encurtada com sucesso.' })
  async create(
    @Body() createUrlDto: CreateUrlDto, 
    @Req() req
  ) {
    const userId = req.user?.id
    return this.urlsService.shorten(createUrlDto, userId)
  }

  @Get('urls/my-urls')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar URLs do usuário logado.' })
  findAllByUserId(@Req() req) {
    return this.urlsService.findAllByUserId(req.user.id)
  }

  @Patch('urls/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar URL de destino (apenas dono).' })
  update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req,
  ) {
    return this.urlsService.update(id, updateUrlDto, req.user.id)
  }

  @Delete('urls/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir logicamente uma URL.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.urlsService.remove(id, req.user.id)
  }

  @Get(':code')
  @ApiOperation({ summary: 'Redirecionar para a URL original (não é possível redirecionar pelo Swagger).' })
  @ApiResponse({ status: 302, description: 'Redirecionamento encontrado.' })
  @ApiResponse({ status: 404, description: 'URL não encontrada.' })
  async redirect(
    @Param('code') code: string, 
    @Res() res: Response) {
      const url = await this.urlsService.findOneByCode(code)

      return res.redirect(url.originalUrl)
  }
}
