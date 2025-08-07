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
    ParseEnumPipe,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
  } from '@nestjs/swagger';
  import { ClaimHistoryService } from './claim-history.service';
  import { CreateClaimDto } from './dto/create-claim.dto';
  import { QueryClaimDto } from './dto/query-claim.dto';
  import { ClaimSummaryDto } from './dto/claim-summary.dto';
  import { ClaimHistory } from './entities/claim-history.entity';
  import { ClaimStatus } from './enums/claim-status.enum';
  
  // Note: Replace with your actual auth guard
  // import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @ApiTags('claim-history')
  @Controller('claim-history')
  export class ClaimHistoryController {
    constructor(private readonly claimHistoryService: ClaimHistoryService) {}
  
    @Post()
    @ApiOperation({ summary: 'Log a new reward claim' })
    @ApiResponse({ status: 201, description: 'Claim logged successfully', type: ClaimHistory })
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard) // Uncomment when you have auth setup
    create(
      @Body() createClaimDto: CreateClaimDto,
      @Request() req: any,
    ) {
      // For now, using a mock user ID - replace with actual user from JWT
      const playerId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.claimHistoryService.createClaim(createClaimDto, playerId);
    }
  
    @Post('bulk')
    @ApiOperation({ summary: 'Log multiple reward claims at once' })
    @ApiResponse({ status: 201, description: 'Claims logged successfully', type: [ClaimHistory] })
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard) // Uncomment when you have auth setup
    createBulk(
      @Body() createClaimDtos: CreateClaimDto[],
      @Request() req: any,
    ) {
      const playerId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.claimHistoryService.bulkCreateClaims(createClaimDtos, playerId);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all claims with optional filtering' })
    @ApiResponse({ status: 200, description: 'Claims retrieved successfully' })
    @ApiQuery({ type: QueryClaimDto })
    findAll(@Query() queryDto: QueryClaimDto) {
      return this.claimHistoryService.findAll(queryDto);
    }
  
    @Get('summary')
    @ApiOperation({ summary: 'Get global claim statistics' })
    @ApiResponse({ status: 200, description: 'Global summary retrieved successfully', type: ClaimSummaryDto })
    getGlobalSummary() {
      return this.claimHistoryService.getGlobalSummary();
    }
  
    @Get('top-rewards')
    @ApiOperation({ summary: 'Get most claimed rewards' })
    @ApiResponse({ status: 200, description: 'Top rewards retrieved successfully' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    getTopRewards(@Query('limit') limit?: number) {
      return this.claimHistoryService.getTopRewards(limit);
    }
  
    @Get('top-players')
    @ApiOperation({ summary: 'Get players with most claims' })
    @ApiResponse({ status: 200, description: 'Top players retrieved successfully' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    getTopPlayers(@Query('limit') limit?: number) {
      return this.claimHistoryService.getTopPlayers(limit);
    }
  
    @Get('player/:playerId')
    @ApiOperation({ summary: 'Get all claims for a specific player' })
    @ApiResponse({ status: 200, description: 'Player claims retrieved successfully' })
    @ApiQuery({ type: QueryClaimDto })
    getPlayerClaims(
      @Param('playerId', ParseUUIDPipe) playerId: string,
      @Query() queryDto: QueryClaimDto,
    ) {
      return this.claimHistoryService.findPlayerClaims(playerId, queryDto);
    }
  
    @Get('player/:playerId/summary')
    @ApiOperation({ summary: 'Get claim summary for a specific player' })
    @ApiResponse({ status: 200, description: 'Player summary retrieved successfully', type: ClaimSummaryDto })
    getPlayerSummary(@Param('playerId', ParseUUIDPipe) playerId: string) {
      return this.claimHistoryService.getPlayerSummary(playerId);
    }
  
    @Get('my-claims')
    @ApiOperation({ summary: 'Get current user\'s claims' })
    @ApiResponse({ status: 200, description: 'User claims retrieved successfully' })
    @ApiQuery({ type: QueryClaimDto })
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard) // Uncomment when you have auth setup
    getMyClaims(
      @Query() queryDto: QueryClaimDto,
      @Request() req: any,
    ) {
      const playerId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.claimHistoryService.findPlayerClaims(playerId, queryDto);
    }
  
    @Get('my-summary')
    @ApiOperation({ summary: 'Get current user\'s claim summary' })
    @ApiResponse({ status: 200, description: 'User summary retrieved successfully', type: ClaimSummaryDto })
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard) // Uncomment when you have auth setup
    getMySummary(@Request() req: any) {
      const playerId = req.user?.id || '123e4567-e89b-12d3-a456-426614174001';
      return this.claimHistoryService.getPlayerSummary(playerId);
    }
  
    @Get('reward/:rewardId')
    @ApiOperation({ summary: 'Get all claims for a specific reward' })
    @ApiResponse({ status: 200, description: 'Reward claims retrieved successfully' })
    @ApiQuery({ type: QueryClaimDto })
    getRewardClaims(
      @Param('rewardId', ParseUUIDPipe) rewardId: string,
      @Query() queryDto: QueryClaimDto,
    ) {
      return this.claimHistoryService.findRewardClaims(rewardId, queryDto);
    }
  
    @Get('check/:playerId/:rewardId')
    @ApiOperation({ summary: 'Check if a player has claimed a specific reward' })
    @ApiResponse({ status: 200, description: 'Claim status checked successfully' })
    checkClaim(
      @Param('playerId', ParseUUIDPipe) playerId: string,
      @Param('rewardId', ParseUUIDPipe) rewardId: string,
    ) {
      return this.claimHistoryService.hasPlayerClaimedReward(playerId, rewardId);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific claim by ID' })
    @ApiResponse({ status: 200, description: 'Claim retrieved successfully', type: ClaimHistory })
    @ApiResponse({ status: 404, description: 'Claim not found' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.claimHistoryService.findOne(id);
    }
  
    @Patch(':id/status')
    @ApiOperation({ summary: 'Update claim status' })
    @ApiResponse({ status: 200, description: 'Claim status updated successfully', type: ClaimHistory })
    @ApiResponse({ status: 404, description: 'Claim not found' })
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard) // Uncomment when you have auth setup
    updateStatus(
      @Param('id', ParseUUIDPipe) id: string,
      @Body('status', new ParseEnumPipe(ClaimStatus)) status: ClaimStatus,
      @Body('notes') notes?: string,
    ) {
      return this.claimHistoryService.updateClaimStatus(id, status, notes);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a claim record' })
    @ApiResponse({ status: 200, description: 'Claim deleted successfully' })
    @ApiResponse({ status: 404, description: 'Claim not found' })
    @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard) // Uncomment when you have auth setup
    remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.claimHistoryService.deleteClaim(id);
    }
  }