import { apiService } from './index';
import { Station } from '../types/train-schedule.types';

export interface StationDto {
  name: string;
  city: string;
}

export class StationService {
  private readonly baseUrl: string = 'stations';

  public async getStations(): Promise<Station[]> {
    try {
      return await apiService.get<Station[]>(this.baseUrl);
    } catch (error) {
      console.error('Помилка при отриманні станцій:', error);
      throw error;
    }
  }

  public async getStationById(id: string): Promise<Station> {
    try {
      return await apiService.get<Station>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Помилка при отриманні станції з ID ${id}:`, error);
      throw error;
    }
  }

  public async searchStations(query: string): Promise<Station[]> {
    try {
      return await apiService.get<Station[]>(`${this.baseUrl}/search/name?query=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Помилка при пошуку станцій:', error);
      throw error;
    }
  }

  public async createStation(stationData: StationDto): Promise<Station> {
    try {
      return await apiService.post<Station>(this.baseUrl, stationData);
    } catch (error) {
      console.error('Помилка при створенні станції:', error);
      throw error;
    }
  }

  public async updateStation(id: string, stationData: StationDto): Promise<Station> {
    try {
      return await apiService.put<Station>(`${this.baseUrl}/${id}`, stationData);
    } catch (error) {
      console.error(`Помилка при оновленні станції з ID ${id}:`, error);
      throw error;
    }
  }

  public async deleteStation(id: string): Promise<boolean> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error(`Помилка при видаленні станції з ID ${id}:`, error);
      throw error;
    }
  }
}

export const stationService = new StationService(); 