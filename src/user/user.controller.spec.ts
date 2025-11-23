import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: User = {
    id: 'f8c0e20e-123f-4a36-9f45-b2a8a327a8a3',
    name: 'Test User',
    email: 'test@example.com',
  } as User;

  const mockUsers: User[] = [
    {
      id: 'b6a98a40-b6df-46c5-88a1-7486e6f7d1c5',
      name: 'User 1',
      email: 'user1@example.com',
    } as User,
    {
      id: 'c7d7f82a-78b1-4e6a-94b7-7f6342d3b457',
      name: 'User 2',
      email: 'user2@example.com',
    } as User,
  ];

  const mockPaginatedResponse = {
    items: mockUsers,
    total: 2,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  };

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
      };

      mockUserService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should propagate service errors', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const error = new Error('Database error');
      mockUserService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow(
        'Database error',
      );
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated users with default parameters', async () => {
      mockUserService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated users with custom parameters', async () => {
      const customResponse = {
        items: mockUsers,
        total: 25,
        page: 2,
        pageSize: 5,
        totalPages: 5,
      };

      mockUserService.findAll.mockResolvedValue(customResponse);

      const result = await controller.findAll(2, 5);

      expect(service.findAll).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual(customResponse);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(
        '222b7b89-8c87-4712-b24f-67c25d3a07a6',
      );

      expect(service.findOne).toHaveBeenCalledWith(
        '222b7b89-8c87-4712-b24f-67c25d3a07a6',
      );
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserService.findOne.mockRejectedValue(
        new NotFoundException(
          'User #7732f28b-567d-458d-a264-9cf8955bdedf not found',
        ),
      );

      await expect(
        controller.findOne('7732f28b-567d-458d-a264-9cf8955bdedf'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        controller.findOne('7732f28b-567d-458d-a264-9cf8955bdedf'),
      ).rejects.toThrow('User #7732f28b-567d-458d-a264-9cf8955bdedf not found');
      expect(service.findOne).toHaveBeenCalledWith(
        '7732f28b-567d-458d-a264-9cf8955bdedf',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'newemail@example.com',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(
        '7732f28b-567d-458d-a264-9cf8955bdedf',
        updateUserDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        '7732f28b-567d-458d-a264-9cf8955bdedf',
        updateUserDto,
      );
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      mockUserService.update.mockRejectedValue(
        new NotFoundException(
          'User #7732f28b-567d-458d-a264-9cf8955bdedf not found',
        ),
      );

      await expect(
        controller.update(
          '7732f28b-567d-458d-a264-9cf8955bdedf',
          updateUserDto,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(
        '7732f28b-567d-458d-a264-9cf8955bdedf',
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(
        '7732f28b-567d-458d-a264-9cf8955bdedf',
      );

      expect(service.remove).toHaveBeenCalledWith(
        '7732f28b-567d-458d-a264-9cf8955bdedf',
      );
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when removing non-existent', async () => {
      mockUserService.remove.mockRejectedValue(
        new NotFoundException(
          'User #7732f28b-567d-458d-a264-9cf8955bdedf not found',
        ),
      );

      await expect(
        controller.remove('7732f28b-567d-458d-a264-9cf8955bdedf'),
      ).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(
        '7732f28b-567d-458d-a264-9cf8955bdedf',
      );
    });
  });
});
