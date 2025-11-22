import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    await this.em.persistAndFlush(user);

    return user;
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponse<User>> {
    const [items, total] = await this.userRepository.findAndCount(
      {},
      {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    );

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) throw new NotFoundException(`User #${id} not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    this.userRepository.assign(user, updateUserDto);
    await this.em.flush();

    return user;
    // return await this.userRepository.nativeUpdate(id, updateUserDto)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    return await this.em.removeAndFlush(user);
  }
}
