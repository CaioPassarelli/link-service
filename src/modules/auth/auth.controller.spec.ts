import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('deve registrar um usuário', async () => {
    const dto = { name: 'Test', email: 't@t.com', password: '123' };
    (authService.register as jest.Mock).mockResolvedValue({ id: '1', ...dto });

    const result = await controller.register(dto);
    expect(result).toHaveProperty('id');
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('deve fazer login', async () => {
    const req = { user: { id: '1', email: 't@t.com' } };
    (authService.login as jest.Mock).mockResolvedValue({ access_token: 'token' });

    const result = await controller.login(req);
    expect(result).toEqual({ access_token: 'token' });
  });
});