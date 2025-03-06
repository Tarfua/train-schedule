import { apiService } from './index';
import { Station } from '../types/train-schedule.types';

/**
 * DTO для створення та оновлення станції
 */
export interface StationDto {
  name: string;
  city: string;
}

/**
 * Сервіс для роботи зі станціями
 */
export class StationService {
  private readonly baseUrl: string = 'stations';

  /**
   * Отримує список всіх станцій
   * @returns Проміс зі списком станцій
   */
  public async getStations(): Promise<Station[]> {
    try {
      return await apiService.get<Station[]>(this.baseUrl);
    } catch (error) {
      console.error('Помилка при отриманні станцій:', error);
      throw error;
    }
  }

  /**
   * Отримує станцію за ID
   * @param id ID станції
   * @returns Проміс зі станцією
   */
  public async getStationById(id: string): Promise<Station> {
    try {
      return await apiService.get<Station>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Помилка при отриманні станції з ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Пошук станцій за назвою
   * @param query Пошуковий запит
   * @returns Проміс зі списком знайдених станцій
   */
  public async searchStations(query: string): Promise<Station[]> {
    try {
      return await apiService.get<Station[]>(`${this.baseUrl}/search/name?query=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Помилка при пошуку станцій:', error);
      throw error;
    }
  }

  /**
   * Створює нову станцію
   * @param stationData Дані станції
   * @returns Проміс зі створеною станцією
   */
  public async createStation(stationData: StationDto): Promise<Station> {
    try {
      return await apiService.post<Station>(this.baseUrl, stationData);
    } catch (error) {
      console.error('Помилка при створенні станції:', error);
      throw error;
    }
  }

  /**
   * Оновлює існуючу станцію
   * @param id ID станції
   * @param stationData Дані станції
   * @returns Проміс із оновленою станцією
   */
  public async updateStation(id: string, stationData: StationDto): Promise<Station> {
    try {
      return await apiService.put<Station>(`${this.baseUrl}/${id}`, stationData);
    } catch (error) {
      console.error(`Помилка при оновленні станції з ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Видаляє станцію
   * @param id ID станції
   * @returns Проміс із булевим значенням успішності видалення
   */
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

// Створюємо екземпляр сервісу для використання в додатку
export const stationService = new StationService(); 