import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }
}
