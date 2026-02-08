import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlDto } from './create-url.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
    @ApiProperty({
        description: 'Novo valor de URL.',
        example: 'https://www.google.com/'
    })
    @IsOptional()
    originalUrl?: string
}
