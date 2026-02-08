import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    })

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.')
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(createUserDto.password, salt)

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: passwordHash
      }
    })

    const { password, ...result } = user

    return result
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }
}
