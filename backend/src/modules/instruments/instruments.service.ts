import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InstrumentsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== ROYALTY STREAMS ====================

  async getRoyaltyStreams(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [streams, total] = await Promise.all([
      this.prisma.royaltyStream.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.royaltyStream.count(),
    ]);

    return {
      streams,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRoyaltyStreamById(id: string) {
    return this.prisma.royaltyStream.findUnique({
      where: { id },
    });
  }

  // ==================== CONTRACT INSTRUMENTS ====================

  async getContractInstruments(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [instruments, total] = await Promise.all([
      this.prisma.contractInstrument.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contractInstrument.count(),
    ]);

    return {
      instruments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getContractInstrumentById(id: string) {
    return this.prisma.contractInstrument.findUnique({
      where: { id },
    });
  }

  // ==================== MUNICIPAL PROJECTS ====================

  async getMunicipalProjects(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.prisma.municipalProject.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.municipalProject.count(),
    ]);

    return {
      projects,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMunicipalProjectById(id: string) {
    return this.prisma.municipalProject.findUnique({
      where: { id },
    });
  }

  // ==================== REWARD PROGRAMS ====================

  async getRewardPrograms(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [programs, total] = await Promise.all([
      this.prisma.rewardProgram.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sponsorOrg: {
            select: { id: true, name: true, logoUrl: true },
          },
          _count: {
            select: { events: true },
          },
        },
      }),
      this.prisma.rewardProgram.count({ where: { isActive: true } }),
    ]);

    return {
      programs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRewardProgramById(id: string) {
    return this.prisma.rewardProgram.findUnique({
      where: { id },
      include: {
        sponsorOrg: true,
      },
    });
  }

  // ==================== STATS ====================

  async getComingSoonStats() {
    const [royaltyCount, contractCount, municipalCount, rewardCount] =
      await Promise.all([
        this.prisma.royaltyStream.count(),
        this.prisma.contractInstrument.count(),
        this.prisma.municipalProject.count(),
        this.prisma.rewardProgram.count({ where: { isActive: true } }),
      ]);

    return {
      royaltyStreams: royaltyCount,
      contractInstruments: contractCount,
      municipalProjects: municipalCount,
      rewardPrograms: rewardCount,
    };
  }
}


















