import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  const mockUrlsService = {
    shorten: jest.fn(),
    findAllByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findOneByCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        { provide: UrlsService, useValue: mockUrlsService },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);
  });

  it('deve chamar shorten', async () => {
    const dto = { originalUrl: 'http://test.com' };
    const req = { user: { id: '123' } };
    await controller.create(dto, req);
    expect(service.shorten).toHaveBeenCalledWith(dto, '123');
  });

  it('deve redirecionar corretamente', async () => {
    const url = { originalUrl: 'http://google.com' };
    (service.findOneByCode as jest.Mock).mockResolvedValue(url);
    
    const res = { redirect: jest.fn() };
    
    await controller.redirect('code123', res as any);
    expect(res.redirect).toHaveBeenCalledWith(url.originalUrl);
  });

  it('deve listar urls do usuário', async () => {
    const req = { user: { id: '123' } };
    await controller.findAllByUserId(req);
    expect(service.findAllByUserId).toHaveBeenCalledWith('123');
  });
});