import axios from 'axios';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import type { Asset } from '../types/index.js';

export class AssetDownloader {
  private downloadDir: string;

  constructor(downloadDir: string = './downloads') {
    this.downloadDir = downloadDir;
    this.ensureDirectoryExists(downloadDir);
  }

  private ensureDirectoryExists(dir: string): void {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  async downloadAsset(asset: Asset): Promise<string> {
    try {
      console.log(`Downloading asset: ${asset.url}`);

      const response = await axios.get(asset.url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      const fileName = this.generateFileName(asset.url, asset.type);
      const localPath = join(this.downloadDir, fileName);

      this.ensureDirectoryExists(dirname(localPath));
      writeFileSync(localPath, response.data);

      console.log(`Asset downloaded to: ${localPath}`);
      return localPath;
    } catch (error) {
      console.error(`Failed to download asset ${asset.url}:`, error);
      throw error;
    }
  }

  async downloadAssets(assets: Asset[]): Promise<Asset[]> {
    const downloadedAssets: Asset[] = [];

    for (const asset of assets) {
      try {
        const localPath = await this.downloadAsset(asset);
        downloadedAssets.push({
          ...asset,
          localPath
        });
      } catch (error) {
        console.warn(`Skipping asset ${asset.url} due to error`);
        downloadedAssets.push(asset);
      }
    }

    return downloadedAssets;
  }

  private generateFileName(url: string, type: string): string {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'asset';
    
    const timestamp = Date.now();
    const extension = this.getExtensionForType(type);
    
    return `${type}/${timestamp}-${filename}${extension ? '.' + extension : ''}`;
  }

  private getExtensionForType(type: string): string {
    const extensions: Record<string, string> = {
      'image': 'jpg',
      'video': 'mp4',
      'font': 'woff2',
      'css': 'css',
      'js': 'js'
    };
    return extensions[type] || '';
  }
}
