// Core Types for GHL Website Cloner

export interface ScrapingResult {
  url: string;
  html: string;
  css: string[];
  javascript: string[];
  assets: Asset[];
  metadata: PageMetadata;
  structure: PageStructure;
  isGHLWebsite: boolean;
}

export interface Asset {
  type: 'image' | 'font' | 'video' | 'file' | 'css' | 'js';
  url: string;
  localPath?: string;
  ghlMediaId?: string;
  size?: number;
  mimeType?: string;
}

export interface PageMetadata {
  title: string;
  description?: string;
  favicon?: string;
  ogImage?: string;
  viewport?: string;
  charset?: string;
}

export interface PageStructure {
  sections: Section[];
  globalStyles: string;
  customCode: {
    head: string;
    body: string;
  };
}

export interface Section {
  id: string;
  type: 'header' | 'hero' | 'content' | 'footer' | 'custom';
  rows: Row[];
  styles: Record<string, string>;
}

export interface Row {
  id: string;
  columns: Column[];
  styles: Record<string, string>;
}

export interface Column {
  id: string;
  width: number; // 1-12 (Bootstrap-style grid)
  elements: Element[];
  styles: Record<string, string>;
}

export interface Element {
  id: string;
  type: 'text' | 'image' | 'button' | 'form' | 'video' | 'custom';
  content: string | Record<string, any>;
  styles: Record<string, string>;
  attributes: Record<string, string>;
}

export interface GHLFunnelData {
  name: string;
  locationId: string;
  pages: GHLPageData[];
  settings: FunnelSettings;
}

export interface GHLPageData {
  name: string;
  url: string;
  html: string;
  css: string;
  javascript: string;
  sections: Section[];
}

export interface FunnelSettings {
  trackingCodeHead?: string;
  trackingCodeBody?: string;
  faviconUrl?: string;
  domainId?: string;
}

export interface CloningJob {
  id: string;
  userId: string;
  sourceUrl: string;
  status: 'pending' | 'scraping' | 'parsing' | 'importing' | 'completed' | 'failed';
  progress: number; // 0-100
  errorMessage?: string;
  scrapingResult?: ScrapingResult;
  funnelData?: GHLFunnelData;
  createdAt: Date;
  completedAt?: Date;
}

export interface GHLAuthTokens {
  accessToken: string;
  refreshToken?: string;
  locationId: string;
  expiresAt?: Date;
}

export interface ScraperOptions {
  waitForSelector?: string;
  timeout?: number;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  downloadAssets?: boolean;
  maxDepth?: number;
}

export interface ParserOptions {
  preserveCustomCSS?: boolean;
  minifyHTML?: boolean;
  removeScripts?: boolean;
  convertToGHLComponents?: boolean;
}
