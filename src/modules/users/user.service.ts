import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { UserEntity } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { locateFilter } from './dto/filter-user.dto';
import axios from 'axios';
import { ResDistanceUser } from './dto/res-distance.dto';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
  async createNewUser(dto: CreateUserDTO): Promise<UserEntity> {
    if (dto.firstname.length == 0)
      throw new HttpException(
        'first name can not null',
        HttpStatus.BAD_REQUEST,
      );
    if (dto.lastname.length == 0)
      throw new HttpException('last name can not null', HttpStatus.BAD_REQUEST);
    if (dto.age < 1 || dto.age > 100)
      throw new HttpException('age must from 1 to 100', HttpStatus.BAD_REQUEST);
    const newUser = await this.userRepository.save({
      firstName: dto.firstname,
      lastName: dto.lastname,
      age: dto.age,
      coordinate: {
        type: 'Point',
        coordinates: [dto.coordinate.lattitude, dto.coordinate.longitude],
      },
    });
    return newUser;
  }

  async getUserInfo(id: string): Promise<UserEntity> {
    const userFind = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userFind)
      throw new HttpException('no user find', HttpStatus.NOT_FOUND);
    return userFind;
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<string> {
    const userFind = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userFind)
      throw new HttpException(
        `user id ${id} not existed`,
        HttpStatus.NOT_FOUND,
      );
    if (dto.firstname.length == 0) dto.firstname = userFind.firstName;
    if (dto.lastname.length == 0) dto.lastname = userFind.lastName;
    if (dto.age == 0) dto.age = userFind.age;
    else if (dto.age < 1 || dto.age > 100)
      throw new HttpException('age must from 1 to 100', HttpStatus.BAD_REQUEST);
    if (dto.coordinate.lattitude == 0 || dto.coordinate.longitude == 0) {
      dto.coordinate.lattitude = userFind.coordinate.coordinates[0];
      dto.coordinate.longitude = userFind.coordinate.coordinates[1];
    }

    try {
      await this.userRepository.update(
        { id: id },
        {
          firstName: dto.firstname,
          lastName: dto.lastname,
          age: dto.age,
          coordinate: {
            type: 'Point',
            coordinates: [dto.coordinate.lattitude, dto.coordinate.longitude],
          },
        },
      );
    } catch (error) {
      throw new HttpException(
        `update not success: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return 'update successful';
  }

  async deleteUser(id: string): Promise<string> {
    const userFind = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!userFind)
      throw new HttpException(
        `user id ${id} not existed`,
        HttpStatus.NOT_FOUND,
      );
    try {
      await this.userRepository.delete({ id: id });
    } catch (error) {
      throw new HttpException(
        `delete not success: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return 'delete successful';
  }

  async searchUserInfo(name: string): Promise<UserEntity[]> {
    const listFind = await this.userRepository
      .createQueryBuilder('users')
      .where('firstName = :name', { name: name })
      .orWhere('lastName = :name', { name: name })
      .orderBy('lastName', 'DESC')
      .execute();

    if (listFind.length == 0 || !listFind)
      throw new HttpException('no users found', HttpStatus.NOT_FOUND);

    return listFind;
  }

  async findNearestUser(filter: locateFilter): Promise<any[]> {
    const { id, n } = filter;
    const listUser = await this.userRepository.find({});
    if (!listUser || listUser.length == 0)
      throw new HttpException('no user found', HttpStatus.NOT_FOUND);
    const userFind = listUser.filter((e) => e.id == id)[0];
    if (!userFind)
      throw new HttpException(
        `user id ${id} not existed`,
        HttpStatus.NOT_FOUND,
      );
    const subListUser = listUser.filter((i) => i.id != id);
    if (!subListUser || subListUser.length == 0)
      throw new HttpException(
        'only have one user in system',
        HttpStatus.NOT_FOUND,
      );

    const apiKey = process.env.GOONG_API_KEY;
    const origin = `${userFind.coordinate['coordinates'][0]},${userFind.coordinate['coordinates'][1]}`;
    const destination = subListUser
      .map((u) => {
        const subDestination = `${u.coordinate['coordinates'][0]},${u.coordinate['coordinates'][1]}`;
        return subDestination;
      })
      .join('%7C');

    const listDistance = await axios.get(
      `https://rsapi.goong.io/DistanceMatrix?origins=${origin}&destinations=${destination}&vehicle=bike&api_key=${apiKey}`,
    );
    const resultDistance = listDistance.data.rows[0].elements;
    const arrUserLocate = [];
    for (let i = 0; i < subListUser.length; i++) {
      const user = { id, distance: 0 };
      user.id = subListUser[i].id;
      user.distance = resultDistance[i]['distance'].value;
      arrUserLocate.push(user);
    }
    arrUserLocate.sort((a, b) => a.distance - b.distance);
    const resDistanceUser = [];
    for (let j = 0; j < n; j++) {
      const userTmp = await this.userRepository.findOne({
        where: { id: arrUserLocate[j].id },
      });
      resDistanceUser.push({
        ...userTmp,
        distance: `${arrUserLocate[j].distance} m`,
      });
    }

    return resDistanceUser;
  }
}
