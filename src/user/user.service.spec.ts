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
  }
  let entityManager: {
    persistAndFlush: jest.Mock;
    flush: jest.Mock;
    removeAndFlush: jest.Mock;
  }

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
      removeAndFlush: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    entityManager = module.get(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const user: User = { id: '27d83ffb-9f45-4554-a7f1-d52272eb2610', name: "John Doe", email: "test@example.com" };

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

  it('findOne', async () => {
    const id: string = "c3394f61-cbcb-4044-9777-b0bb8f3182db";
    const user: User = { id, name: "Ana Beatriz", email: "anabea@gmail.com" };

    userRepository.findOne.mockReturnValue(user);

    const result = await service.findOne(id);

    expect(userRepository.findOne).toHaveBeenCalledWith({ id: "c3394f61-cbcb-4044-9777-b0bb8f3182db" });
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException when user not found', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    await expect(service.findOne('999')).rejects.toThrow('User #999 not found');
  });

  it('should update a user', async () => {
    const user: User = { id: '27d83ffb-9f45-4554-a7f1-d52272eb2610', name: "John Doe", email: "test@example.com" };

    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };

    userRepository.assign.mockReturnValue(undefined);
    userRepository.findOne.mockResolvedValue(user);
    entityManager.flush.mockResolvedValue(undefined);

    const result = await service.update('27d83ffb-9f45-4554-a7f1-d52272eb2610', updateUserDto);

    expect(userRepository.findOne).toHaveBeenCalledWith({ id: '27d83ffb-9f45-4554-a7f1-d52272eb2610' });
    expect(userRepository.assign).toHaveBeenCalledWith(user, updateUserDto);
    expect(entityManager.flush).toHaveBeenCalled();
    expect(result).toEqual(user);
  });

  it('should throw NotFoundException when updating non-existent user', async () => {
    const updatedUserDto: UpdateUserDto = {
      name: 'Updated Name'
    };

    userRepository.findOne.mockResolvedValue(null);

    await expect(service.update('999',
      updatedUserDto)).rejects.toThrow(
        NotFoundException)
  });

  it('should remove a user', async () => {
    const user: User = { id: '27d83ffb-9f45-4554-a7f1-d52272eb2610', name: "John Doe", email: "test@example.com" };

    userRepository.findOne.mockResolvedValue(user);
    entityManager.removeAndFlush.mockResolvedValue(undefined);

    await service.remove('27d83ffb-9f45-4554-a7f1-d52272eb2610');

    expect(userRepository.findOne).toHaveBeenCalledWith({ id: '27d83ffb-9f45-4554-a7f1-d52272eb2610' });
    expect(entityManager.removeAndFlush).toHaveBeenCalledWith(user);
  });

  it('should throw NotFoundException when removing non-existent user', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    expect(entityManager.removeAndFlush).not.toHaveBeenCalled();
  });

});
