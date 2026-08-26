import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(id);

    Object.assign(user, dto);

    return this.userRepository.save(user);
  }
}
