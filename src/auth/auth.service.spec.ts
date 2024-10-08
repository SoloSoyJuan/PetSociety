import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'mockToken'),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const createUserDto = { email: 'test@test.com', password: 'password123', name: 'Test', role: 'owner' };
      const user = { id: 1, email: 'test@test.com', password: 'hashedPassword', name: 'Test', role: 'owner' };
      
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');

      const result = await service.createUser(createUserDto);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        name: 'Test',
        password: 'hashedPassword',
        role: 'owner'
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should handle DB errors', async () => {
      const createUserDto = { email: 'test@test.com', password: 'password123', name: 'Test', role: 'owner' };
      mockUserRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.createUser(createUserDto)).rejects.toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const loginUserDto = { email: 'test@test.com', password: 'password123' };
      const user = { id: 1, email: 'test@test.com', password: 'hashedPassword', name: 'Test', role: 'owner' };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await service.loginUser(loginUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginUserDto.email },
        select: ['id', 'email', 'password'],
      });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(loginUserDto.password, user.password);
      expect(result).toEqual({
        user_id: user.id,
        email: user.email,
        token: 'mockToken',
      });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginUserDto = { email: 'test@test.com', password: 'password123' };
      mockUserRepository.findOne.mockResolvedValue(null); // User not found

      await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid credentials');
    });
  });

});
