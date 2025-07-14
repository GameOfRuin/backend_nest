import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto, SortDirectionEnum } from '../../../shared';

export enum TaskSortByEnum {
  id = 'id',
  title = 'title',
  description = 'description',
  article = 'article',
}

export class GetArticleListDto extends PaginationDto {
  @ApiProperty({ example: 'Где осуществляется поиск например description' })
  @IsEnum(TaskSortByEnum)
  @IsOptional()
  sortBy: TaskSortByEnum = TaskSortByEnum.id;

  @ApiProperty({ example: 'На убывание или на возрастание' })
  @IsEnum(SortDirectionEnum)
  @IsOptional()
  sortDirection: SortDirectionEnum = SortDirectionEnum.asc;

  @ApiProperty({ example: 'Ключевое слово для поиска' })
  @IsString()
  @IsOptional()
  search?: string;
}
