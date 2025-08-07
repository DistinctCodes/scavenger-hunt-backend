import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Review } from './entities/review.entity';
  import { CreateReviewDto } from './dto/create-review.dto';
  import { UpdateReviewDto } from './dto/update-review.dto';
  import { QueryReviewDto } from './dto/query-review.dto';
  
  export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  }
  
  export interface PaginatedReviews {
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  @Injectable()
  export class ReviewsService {
    constructor(
      @InjectRepository(Review)
      private reviewRepository: Repository<Review>,
    ) {}
  
    async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
      // Check if user already reviewed this challenge
      const existingReview = await this.reviewRepository.findOne({
        where: {
          challengeId: createReviewDto.challengeId,
          userId,
        },
      });
  
      if (existingReview) {
        throw new ConflictException('You have already reviewed this puzzle');
      }
  
      const review = this.reviewRepository.create({
        ...createReviewDto,
        userId,
      });
  
      return this.reviewRepository.save(review);
    }
  
    async findAll(queryDto: QueryReviewDto): Promise<PaginatedReviews> {
      const {
        challengeId,
        userId,
        minStars,
        maxStars,
        page = 1,
        limit = 10,
        sort = 'newest',
      } = queryDto;
  
      const queryBuilder = this.reviewRepository.createQueryBuilder('review');
  
      // Apply filters
      if (challengeId) {
        queryBuilder.andWhere('review.challengeId = :challengeId', { challengeId });
      }
  
      if (userId) {
        queryBuilder.andWhere('review.userId = :userId', { userId });
      }
  
      if (minStars) {
        queryBuilder.andWhere('review.stars >= :minStars', { minStars });
      }
  
      if (maxStars) {
        queryBuilder.andWhere('review.stars <= :maxStars', { maxStars });
      }
  
      // Apply sorting
      switch (sort) {
        case 'newest':
          queryBuilder.orderBy('review.createdAt', 'DESC');
          break;
        case 'oldest':
          queryBuilder.orderBy('review.createdAt', 'ASC');
          break;
        case 'highest':
          queryBuilder.orderBy('review.stars', 'DESC');
          break;
        case 'lowest':
          queryBuilder.orderBy('review.stars', 'ASC');
          break;
      }
  
      // Apply pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);
  
      const [reviews, total] = await queryBuilder.getManyAndCount();
  
      return {
        reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
  
    async findOne(id: string): Promise<Review> {
      const review = await this.reviewRepository.findOne({ where: { id } });
      
      if (!review) {
        throw new NotFoundException('Review not found');
      }
  
      return review;
    }
  
    async findByUser(userId: string, challengeId: string): Promise<Review | null> {
      return this.reviewRepository.findOne({
        where: { userId, challengeId },
      });
    }
  
    async update(
      id: string,
      updateReviewDto: UpdateReviewDto,
      userId: string,
    ): Promise<Review> {
      const review = await this.findOne(id);
  
      // Check if user owns this review
      if (review.userId !== userId) {
        throw new ForbiddenException('You can only update your own reviews');
      }
  
      Object.assign(review, updateReviewDto);
      return this.reviewRepository.save(review);
    }
  
    async remove(id: string, userId: string): Promise<void> {
      const review = await this.findOne(id);
  
      // Check if user owns this review
      if (review.userId !== userId) {
        throw new ForbiddenException('You can only delete your own reviews');
      }
  
      await this.reviewRepository.remove(review);
    }
  
    async getReviewStats(challengeId: string): Promise<ReviewStats> {
      const reviews = await this.reviewRepository.find({
        where: { challengeId },
        select: ['stars'],
      });
  
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }
  
      const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
      const averageRating = Number((totalStars / reviews.length).toFixed(2));
  
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.stars]++;
      });
  
      return {
        averageRating,
        totalReviews: reviews.length,
        ratingDistribution,
      };
    }
  }