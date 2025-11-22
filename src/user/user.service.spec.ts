import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { EntityManager } from '@mikro-orm/mysql';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: {
    create: jest.Mock;
    findOne: jest.Mock;
    findAndCount: jest.Mock;
    assign: jest.Mock;
  };
  let entityManager: {
    persistAndFlush: jest.Mock;
    flush: jest.Mock;
    removeAndFlush: jest.Mock;
  };

  beforeEach(async () => {
    const mockUsersRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      assign: jest.fn(),
    };

    const mockEntityManager = {
      persistAndFlush: jest.fn(),
      flush: jest.fn(),
      removeAndFlush: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    entityManager = module.get(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: User = {
        id: '27d83ffb-9f45-4554-a7f1-d52272eb2610',
        name: 'John Doe',
        email: 'test@example.com',
      };

      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'test@example.com',
      };

      userRepository.create.mockReturnValue(user);
      entityManager.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(entityManager.persistAndFlush).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should propagate repository errors', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@mail.com',
        name: 'John Doe',
      };

      const error = new Error('Database error');

      userRepository.create.mockImplementation(() => {
        throw error;
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users with default pagination', async () => {
      const users: User[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user1@example.com',
          name: 'User 1',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'user2@example.com',
          name: 'User 2',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          email: 'user3@example.com',
          name: 'User 3',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          email: 'user4@example.com',
          name: 'User 4',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          email: 'user5@example.com',
          name: 'User 5',
        },
      ];

      userRepository.findAndCount.mockResolvedValue([users, 5]);

      const result = await service.findAll();

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        {
          limit: 10,
          offset: 0,
        },
      );
      expect(result).toEqual({
        items: users,
        total: 5,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });
    });

    it('should return paginated users with custom pagination', async () => {
      const users: User[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user1@example.com',
          name: 'User 1',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'user2@example.com',
          name: 'User 2',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          email: 'user3@example.com',
          name: 'User 3',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          email: 'user4@example.com',
          name: 'User 4',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          email: 'user5@example.com',
          name: 'User 5',
        },
      ];

      userRepository.findAndCount.mockResolvedValue([users, 5]);

      const result = await service.findAll(1, 5);

      expect(userRepository.findAndCount).toHaveBeenCalledWith(
        {},
        {
          limit: 5,
          offset: 0,
        },
      );

      expect(result).toEqual({
        items: users,
        total: 5,
        page: 1,
        pageSize: 5,
        totalPages: 1,
      });
    });

    it('should calculate total pages correctly', async () => {
      const users: User[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user1@example.com',
          name: 'User 1',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'user2@example.com',
          name: 'User 2',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          email: 'user3@example.com',
          name: 'User 3',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          email: 'user4@example.com',
          name: 'User 4',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          email: 'user5@example.com',
          name: 'User 5',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440005',
          email: 'user6@example.com',
          name: 'User 6',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440006',
          email: 'user7@example.com',
          name: 'User 7',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          email: 'user8@example.com',
          name: 'User 8',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440008',
          email: 'user9@example.com',
          name: 'User 9',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440009',
          email: 'user10@example.com',
          name: 'User 10',
        },
        {
          id: '550e8400-e29b-41d4-a716-44665544000a',
          email: 'user11@example.com',
          name: 'User 11',
        },
        {
          id: '550e8400-e29b-41d4-a716-44665544000b',
          email: 'user12@example.com',
          name: 'User 12',
        },
        {
          id: '550e8400-e29b-41d4-a716-44665544000c',
          email: 'user13@example.com',
          name: 'User 13',
        },
        {
          id: '550e8400-e29b-41d4-a716-44665544000d',
          email: 'user14@example.com',
          name: 'User 14',
        },
        {
          id: '550e8400-e29b-41d4-a716-44665544000e',
          email: 'user15@example.com',
          name: 'User 15',
        },
        {
          id: '550e8400-e29b-41d4-a716-44665544000f',
          email: 'user16@example.com',
          name: 'User 16',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440010',
          email: 'user17@example.com',
          name: 'User 17',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440011',
          email: 'user18@example.com',
          name: 'User 18',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440012',
          email: 'user19@example.com',
          name: 'User 19',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440013',
          email: 'user20@example.com',
          name: 'User 20',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440014',
          email: 'user21@example.com',
          name: 'User 21',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440015',
          email: 'user22@example.com',
          name: 'User 22',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440016',
          email: 'user23@example.com',
          name: 'User 23',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440017',
          email: 'user24@example.com',
          name: 'User 24',
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440018',
          email: 'user25@example.com',
          name: 'User 25',
        },
      ];

      userRepository.findAndCount.mockResolvedValue([users, 25]);

      const result = await service.findAll(1, 10);

      expect(result.totalPages).toBe(3);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id: string = 'c3394f61-cbcb-4044-9777-b0bb8f3182db';
      const user: User = { id, name: 'Ana Beatriz', email: 'anabea@gmail.com' };

      userRepository.findOne.mockReturnValue(user);

      const result = await service.findOne(id);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        id: 'c3394f61-cbcb-4044-9777-b0bb8f3182db',
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow(
        'User #999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user: User = {
        id: '27d83ffb-9f45-4554-a7f1-d52272eb2610',
        name: 'John Doe',
        email: 'test@example.com',
      };

      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      userRepository.assign.mockReturnValue(undefined);
      userRepository.findOne.mockResolvedValue(user);
      entityManager.flush.mockResolvedValue(undefined);

      const result = await service.update(
        '27d83ffb-9f45-4554-a7f1-d52272eb2610',
        updateUserDto,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        id: '27d83ffb-9f45-4554-a7f1-d52272eb2610',
      });
      expect(userRepository.assign).toHaveBeenCalledWith(user, updateUserDto);
      expect(entityManager.flush).toHaveBeenCalled();
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      const updatedUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updatedUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user: User = {
        id: '27d83ffb-9f45-4554-a7f1-d52272eb2610',
        name: 'John Doe',
        email: 'test@example.com',
      };

      userRepository.findOne.mockResolvedValue(user);
      entityManager.removeAndFlush.mockResolvedValue(undefined);

      await service.remove('27d83ffb-9f45-4554-a7f1-d52272eb2610');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        id: '27d83ffb-9f45-4554-a7f1-d52272eb2610',
      });
      expect(entityManager.removeAndFlush).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException when removing non-existent user', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(entityManager.removeAndFlush).not.toHaveBeenCalled();
    });
  });
});
