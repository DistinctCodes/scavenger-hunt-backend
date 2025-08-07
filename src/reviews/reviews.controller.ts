import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
  } from '@nestjs/swagger';
  import { ReviewsService } from './reviews.service';
  import { CreateReviewDto } from './dto/create-review.dto';
  import { UpdateReviewDto } from './dto/update-review.dto';
  import { QueryReviewDto } from './dto/query-review.dto';
  import { Review } from './entities/review.entity';
  
  @ApiTags('reviews')
  @Controller('reviews')
  export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new review' })
    @ApiResponse({ status: 201, description: 'Review created successfully', type: Review })
    @ApiResponse({ status: 409, description: 'User already reviewed this puzzle' })
    @ApiBearerAuth()
    create(
      @Body() createReviewDto: CreateReviewDto,
      @Request() req: any,
    ) {
      // Note: replace with actual user from JWT
      const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.reviewsService.create(createReviewDto, userId);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all reviews with optional filtering' })
    @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
    @ApiQuery({ type: QueryReviewDto })
    findAll(@Query() queryDto: QueryReviewDto) {
      return this.reviewsService.findAll(queryDto);
    }
  
    @Get('stats/:challengeId')
    @ApiOperation({ summary: 'Get review statistics for a challenge' })
    @ApiResponse({ status: 200, description: 'Review statistics retrieved successfully' })
    getStats(@Param('challengeId', ParseUUIDPipe) challengeId: string) {
      return this.reviewsService.getReviewStats(challengeId);
    }
  
    @Get('user/:challengeId')
    @ApiOperation({ summary: 'Get current user\'s review for a specific challenge' })
    @ApiResponse({ status: 200, description: 'User review retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    @ApiBearerAuth()
    getUserReview(
      @Param('challengeId', ParseUUIDPipe) challengeId: string,
      @Request() req: any,
    ) {
      const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.reviewsService.findByUser(userId, challengeId);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific review by ID' })
    @ApiResponse({ status: 200, description: 'Review retrieved successfully', type: Review })
    @ApiResponse({ status: 404, description: 'Review not found' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.reviewsService.findOne(id);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a review' })
    @ApiResponse({ status: 200, description: 'Review updated successfully', type: Review })
    @ApiResponse({ status: 403, description: 'Can only update your own reviews' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    @ApiBearerAuth()
    update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateReviewDto: UpdateReviewDto,
      @Request() req: any,
    ) {
      const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.reviewsService.update(id, updateReviewDto, userId);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a review' })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    @ApiResponse({ status: 403, description: 'Can only delete your own reviews' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    @ApiBearerAuth()
    remove(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req: any,
    ) {
      const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.reviewsService.remove(id, userId);
    }
  }