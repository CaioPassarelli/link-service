import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.usersService.findByEmail(email)
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (user && isValidPassword) {
            const { password, ...result } = user
            return result
        }

        return null
    }

    async login(user: Omit<User, 'password'>) {
        const payload = { email: user.email, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }
}
