import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  findByProduct(productId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  create(userId: string, dto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      user: { id: userId } as any,
      product: { id: dto.productId } as any,
      rating: dto.rating,
      comment: dto.comment,
    });

    return this.reviewRepository.save(review);
  }
}
