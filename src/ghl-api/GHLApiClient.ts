import axios, { AxiosInstance } from 'axios';
import type { GHLAuthTokens } from '../types/index.js';

export class GHLApiClient {
  private client: AxiosInstance;
  private baseURL = 'https://services.leadconnectorhq.com';

  constructor(private authTokens: GHLAuthTokens) {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${authTokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get list of all funnels for a location
   */
  async getFunnels(params?: {
    type?: string;
    category?: string;
    offset?: string;
    limit?: string;
    name?: string;
  }) {
    try {
      const response = await this.client.get('/funnels/funnel/list', {
        params: {
          locationId: this.authTokens.locationId,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching funnels:', error);
      throw error;
    }
  }

  /**
   * Get list of funnel pages
   */
  async getFunnelPages(funnelId: string, params?: {
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const response = await this.client.get('/funnels/page', {
        params: {
          locationId: this.authTokens.locationId,
          funnelId,
          limit: params?.limit || 100,
          offset: params?.offset || 0,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching funnel pages:', error);
      throw error;
    }
  }

  /**
   * Upload media file to GHL
   * Note: This endpoint may need to be verified in the actual API
   */
  async uploadMedia(file: Buffer, fileName: string, mimeType: string) {
    try {
      const formData = new FormData();
      const blob = new Blob([file], { type: mimeType });
      formData.append('file', blob, fileName);
      formData.append('locationId', this.authTokens.locationId);

      const response = await this.client.post('/medias/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Get location details
   */
  async getLocation() {
    try {
      const response = await this.client.get(`/locations/${this.authTokens.locationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  }
}
