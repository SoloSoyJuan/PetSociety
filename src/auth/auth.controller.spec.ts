import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            loginUser: jest.fn(),
            findAllUsers: jest.fn(),
            findUserById: jest.fn(),
            findUsersByRole: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('createUser', () => {
    it('should call authService.createUser with correct parameters', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password123', name: 'Test', role: 'owner' };
      await authController.createUser(createUserDto);
      expect(authService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('loginUser', () => {
    it('should call authService.loginUser with correct parameters', async () => {
      const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'password123' };
      await authController.loginUser(loginUserDto);
      expect(authService.loginUser).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('getAllUsers', () => {
    it('should call authService.findAllUsers', async () => {
      await authController.getAllUsers();
      expect(authService.findAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should call authService.findUserById with correct id', async () => {
      const id = 1;
      await authController.getUserById(id);
      expect(authService.findUserById).toHaveBeenCalledWith(id);
    });
  });

  describe('getUsersByRole', () => {
    it('should call authService.findUsersByRole with correct role', async () => {
      const role = 'admin';
      await authController.getUsersByRole(role);
      expect(authService.findUsersByRole).toHaveBeenCalledWith(role);
    });
  });

  describe('updateUser', () => {
    it('should call authService.updateUser with correct id and parameters', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = { email: 'newemail@example.com' };
      await authController.updateUser(id, updateUserDto);
      expect(authService.updateUser).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should call authService.deleteUser with correct id', async () => {
      const id = 1;
      await authController.deleteUser(id);
      expect(authService.deleteUser).toHaveBeenCalledWith(id);
    });
  });
});
