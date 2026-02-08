import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateUrlDto {
    @ApiProperty({
        description: 'A URL original que será encurtada.',
        example: 'https://rocketseat.com.br'
    })
    @IsNotEmpty({ message: 'A URL de origem é obrigatória.'})
    @IsUrl({}, { message: 'A URL informada é inválida.'})
    originalUrl: string
}
