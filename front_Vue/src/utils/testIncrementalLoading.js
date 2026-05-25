import { assetManager } from '@/data/models/assetManager';
import { logger } from '@/utils/logger';

async function testIncrementalLoading() {
  logger.info('Test', 'Starting incremental load test');
  const hall1 = await assetManager.getModelUrl('hall-1');
  if (hall1.includes('v=a1b2c3d4')) {
    logger.info('Test', 'Load success');
  } else {
    logger.error('Test', 'Load fail');
  }
}
