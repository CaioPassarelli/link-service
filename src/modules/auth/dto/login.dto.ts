import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'teste@teste.com' })
    email: string

    @ApiProperty({ example: 'Minha senha' })
    password: string
}