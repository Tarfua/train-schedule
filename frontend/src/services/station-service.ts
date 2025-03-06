import { apiService } from './index';
import { Station } from '../types/train-schedule.types';

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
}

// Створюємо екземпляр сервісу для використання в додатку
export const stationService = new StationService(); 