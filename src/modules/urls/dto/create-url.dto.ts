import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateUrlDto {
    @IsNotEmpty({ message: 'A URL de origem é obrigatória.'})
    @IsUrl({}, { message: 'A URL informada é inválida.'})
    originalUrl: string
}
