import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/mysql';

@Injectable()
export class UserService {
  // private readonly logger = new Logger(UserService.name);

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

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) throw new NotFoundException(`User #${id} not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    wrap(user).assign(updateUserDto);
    await this.em.flush();

    return user;
    // return await this.userRepository.nativeUpdate(id, updateUserDto)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    return await this.em.removeAndFlush(user);
  }
}
