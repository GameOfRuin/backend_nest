import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { JwtGuard } from '../../guards/jwt.guard';
import { IdNumberDto } from '../../shared/id-number.dto';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ArticleUpdateDto } from './dto/article-update.dto';
import { GetArticleListDto } from './dto/sort-by.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiCreatedResponse({ type: ArticleResponseDto })
  @ApiOperation({ summary: 'Создание новой статьи' })
  @Post('create')
  async creatArticle(@Body() dto: CreateArticleDto, @Req() request: FastifyRequest) {
    return await this.articleService.creatArticle(dto, request.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiCreatedResponse({ type: ArticleResponseDto })
  @ApiOperation({ summary: 'Изменение статьи' })
  @Put('/:id')
  async updateArticle(
    @Body() dto: ArticleUpdateDto,
    @Req() request: FastifyRequest,
    @Param() { id }: IdNumberDto,
  ) {
    return await this.articleService.updateArticle(dto, request.user.id, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Удаление статьи' })
  @Delete('/:id')
  async delete(@Req() request: FastifyRequest, @Param() { id }: IdNumberDto) {
    return await this.articleService.delete(request.user.id, id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поиск задачи по id' })
  @Get('/:id')
  async getArticle(@Param() { id }: IdNumberDto) {
    return await this.articleService.getArticleById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поиск задачи по id' })
  @Get('/')
  async getAllArticle(@Query() query: GetArticleListDto) {
    return await this.articleService.getAllArticle(query);
  }
}
