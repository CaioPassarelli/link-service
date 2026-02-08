import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsString,
    MinLength,
    IsOptional,
} from 'class-validator'

export class CreateUserDto {
    @ApiProperty({
        description: 'E-mail para login (deve ser único)',
    })
    @IsEmail({}, { message: 'O e-mail informado é inválido. '})
    email: string

    @ApiProperty({
        description: 'Senha de acesso (mínimo 6 caracteres)',
    })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres. '})
    password: string

    @ApiProperty({
        description: 'Nome completo do usuário',
    })
    @IsString()
    @IsOptional()
    name?: string
}
