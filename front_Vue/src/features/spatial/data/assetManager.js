import { logger } from '@/utils/logger';

// 모델 에셋 목록 (해시 포함 - 실제 빌드 시 자동화)
export const MODEL_ASSETS = {
  'hall-1': { url: '/models/hall-1.glb', hash: 'a1b2c3d4' },
  'hall-2': { url: '/models/hall-2.glb', hash: 'e5f6g7h8' },
  // ... 추가 모델
};

export const assetManager = {
  async getModelUrl(id) {
    const asset = MODEL_ASSETS[id];
    if (!asset) return null;
    logger.info('AssetManager', `Loading ${id} with hash ${asset.hash}`);
    return `${asset.url}?v=${asset.hash}`;
  }
};
