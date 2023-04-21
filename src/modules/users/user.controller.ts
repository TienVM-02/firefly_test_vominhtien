import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { idFilter, locateFilter, nameFilter } from './dto/filter-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add')
  async createNewUser(@Body() user: CreateUserDTO): Promise<UserEntity> {
    return await this.userService.createNewUser(user);
  }

  @Get('/read')
  async getUserInfo(@Query() idFilter: idFilter): Promise<UserEntity> {
    return await this.userService.getUserInfo(idFilter.id);
  }

  @Get('/search')
  async searchUser(@Query() nameFilter: nameFilter): Promise<UserEntity[]> {
    return await this.userService.searchUserInfo(nameFilter.name);
  }

  @Put('/edit/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
  ): Promise<string> {
    return await this.userService.updateUser(id, dto);
  }

  @Delete('/edit/:id')
  async deleteUser(@Param('id') id: string): Promise<string> {
    return await this.userService.deleteUser(id);
  }

  @Get('/locate')
  async findNearestUser(@Query() filter: locateFilter): Promise<any[]> {
    return await this.userService.findNearestUser(filter);
  }
}
