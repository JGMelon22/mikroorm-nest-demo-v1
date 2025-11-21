import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@ApiTags('Users')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description:
      'Creates a user with name, email, password, and profile image.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

@Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns a list of all registered users.',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Number of items per page', example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of users successfully returned.',
    type: User,
    isArray: true,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<PaginatedResponse<User>> {
    return await this.userService.findAll(+page, +pageSize);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Returns the user corresponding to the given ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User successfully found.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates the information of an existing user.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
