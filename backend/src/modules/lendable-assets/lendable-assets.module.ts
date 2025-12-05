import { Module } from '@nestjs/common';
import { LendableAssetsService } from './lendable-assets.service';
import { LendableAssetsController } from './lendable-assets.controller';

@Module({
  controllers: [LendableAssetsController],
  providers: [LendableAssetsService],
  exports: [LendableAssetsService],
})
export class LendableAssetsModule {}


















