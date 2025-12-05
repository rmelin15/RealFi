import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole, KycStatus } from '@prisma/client';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    const result = await this.usersService.getAll(page, limit);
    return {
      data: result.users,
      meta: result.meta,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return {
      data: user ? this.usersService.sanitizeUser(user) : null,
    };
  }

  @Patch(':id/kyc-status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user KYC status (Admin only)' })
  async updateKycStatus(
    @Param('id') id: string,
    @Body('status') status: KycStatus,
  ) {
    const user = await this.usersService.updateKycStatus(id, status);
    return {
      data: this.usersService.sanitizeUser(user),
      message: 'KYC status updated',
    };
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  async updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    const user = await this.usersService.updateRole(id, role);
    return {
      data: this.usersService.sanitizeUser(user),
      message: 'Role updated',
    };
  }
}


















