import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { InstrumentsService } from './instruments.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('instruments')
@Controller()
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  // ==================== ROYALTY STREAMS ====================

  @Get('royalty-streams')
  @Public()
  @ApiOperation({ summary: 'List royalty streams (Coming Soon)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRoyaltyStreams(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.instrumentsService.getRoyaltyStreams(page, limit);
    return {
      data: result.streams,
      meta: {
        ...result.meta,
        comingSoon: true,
        message: 'Tokenized royalties and revenue streams - Coming Soon',
      },
    };
  }

  @Get('royalty-streams/:id')
  @Public()
  @ApiOperation({ summary: 'Get royalty stream by ID' })
  async getRoyaltyStream(@Param('id') id: string) {
    const stream = await this.instrumentsService.getRoyaltyStreamById(id);
    return {
      data: stream,
      meta: { comingSoon: true },
    };
  }

  // ==================== CONTRACT INSTRUMENTS ====================

  @Get('contract-instruments')
  @Public()
  @ApiOperation({ summary: 'List contract instruments (Coming Soon)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getContractInstruments(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.instrumentsService.getContractInstruments(
      page,
      limit,
    );
    return {
      data: result.instruments,
      meta: {
        ...result.meta,
        comingSoon: true,
        message: 'Tokenized contracts and licenses - Coming Soon',
      },
    };
  }

  @Get('contract-instruments/:id')
  @Public()
  @ApiOperation({ summary: 'Get contract instrument by ID' })
  async getContractInstrument(@Param('id') id: string) {
    const instrument =
      await this.instrumentsService.getContractInstrumentById(id);
    return {
      data: instrument,
      meta: { comingSoon: true },
    };
  }

  // ==================== MUNICIPAL PROJECTS ====================

  @Get('municipal-projects')
  @Public()
  @ApiOperation({ summary: 'List municipal projects (Coming Soon)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMunicipalProjects(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.instrumentsService.getMunicipalProjects(
      page,
      limit,
    );
    return {
      data: result.projects,
      meta: {
        ...result.meta,
        comingSoon: true,
        message: 'Municipal and civic projects - Coming Soon',
      },
    };
  }

  @Get('municipal-projects/:id')
  @Public()
  @ApiOperation({ summary: 'Get municipal project by ID' })
  async getMunicipalProject(@Param('id') id: string) {
    const project = await this.instrumentsService.getMunicipalProjectById(id);
    return {
      data: project,
      meta: { comingSoon: true },
    };
  }

  // ==================== REWARD PROGRAMS ====================

  @Get('rewards/programs')
  @Public()
  @ApiOperation({ summary: 'List reward programs (Coming Soon)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRewardPrograms(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.instrumentsService.getRewardPrograms(page, limit);
    return {
      data: result.programs,
      meta: {
        ...result.meta,
        comingSoon: true,
        message: 'ESG & behavior reward programs - Coming Soon',
      },
    };
  }

  @Get('rewards/programs/:id')
  @Public()
  @ApiOperation({ summary: 'Get reward program by ID' })
  async getRewardProgram(@Param('id') id: string) {
    const program = await this.instrumentsService.getRewardProgramById(id);
    return {
      data: program,
      meta: { comingSoon: true },
    };
  }

  // ==================== COMING SOON OVERVIEW ====================

  @Get('coming-soon/stats')
  @Public()
  @ApiOperation({ summary: 'Get coming soon module statistics' })
  async getComingSoonStats() {
    const stats = await this.instrumentsService.getComingSoonStats();
    return {
      data: stats,
      meta: {
        message: 'These features are in development and will be available soon',
      },
    };
  }
}


















