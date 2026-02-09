import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve validar o usuário com senha correta', async () => {
    const user = { id: '1', email: 'test@test.com', password: 'hashed_password' };
    (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

    const result = await service.validateUser('test@test.com', '123');
    expect(result).toEqual({ id: '1', email: 'test@test.com' });
  });

  it('deve retornar null se senha incorreta', async () => {
    const user = { id: '1', email: 'test@test.com', password: 'hashed_password' };
    (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

    const result = await service.validateUser('test@test.com', 'wrong');
    expect(result).toBeNull();
  });

  it('deve retornar token de acesso no login', async () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test' };
    const result = await service.login(user as any);
    expect(result).toEqual({ access_token: 'test_token' });
  });
});