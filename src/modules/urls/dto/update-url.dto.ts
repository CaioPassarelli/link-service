import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlDto } from './create-url.dto';
import { IsOptional } from 'class-validator';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
    @IsOptional()
    originalUrl?: string
}
