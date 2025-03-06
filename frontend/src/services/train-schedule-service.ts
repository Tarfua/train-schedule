import { apiService } from './index';
import { TrainSchedule } from '../types/train-schedule.types';

export interface TrainScheduleDto {
  trainNumber: string;
  departureStationId: string;
  arrivalStationId: string;
  departureTime: string;
  arrivalTime: string;
  departurePlatform?: number;
  arrivalPlatform?: number;
}

export class TrainScheduleService {
  private readonly baseUrl: string = 'train-schedules';

  public async getTrainSchedules(): Promise<TrainSchedule[]> {
    try {
      return await apiService.get<TrainSchedule[]>(this.baseUrl);
    } catch (error) {
      console.error('Помилка при отриманні розкладу потягів:', error);
      throw error;
    }
  }

  public async getScheduleByStation(stationId: string): Promise<TrainSchedule[]> {
    try {
      const allSchedules = await this.getTrainSchedules();
      
      return allSchedules.filter(schedule => 
        schedule.departureStationId === stationId || 
        schedule.arrivalStationId === stationId
      );
    } catch (error) {
      console.error(`Помилка при отриманні розкладу для станції ${stationId}:`, error);
      throw error;
    }
  }

  public filterRecentAndUpcomingSchedules(
    schedules: TrainSchedule[], 
    stationType: 'departures' | 'arrivals'
  ): TrainSchedule[] {
    const now = new Date();
    // 10 хвилин тому
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    
    return schedules.filter(schedule => {
      const timeStr = stationType === 'departures' 
        ? schedule.departureTime 
        : schedule.arrivalTime;
      
      const scheduleTime = new Date(timeStr);
      
      return scheduleTime >= tenMinutesAgo;
    });
  }

  public async getTrainScheduleById(id: string): Promise<TrainSchedule> {
    try {
      return await apiService.get<TrainSchedule>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Помилка при отриманні розкладу потяга з ID ${id}:`, error);
      throw error;
    }
  }

  public async createTrainSchedule(data: TrainScheduleDto): Promise<TrainSchedule> {
    try {
      return await apiService.post<TrainSchedule>(this.baseUrl, data);
    } catch (error) {
      console.error('Помилка при створенні розкладу потяга:', error);
      throw error;
    }
  }

  public async updateTrainSchedule(id: string, data: TrainScheduleDto): Promise<TrainSchedule> {
    try {
      return await apiService.patch<TrainSchedule>(`${this.baseUrl}/${id}`, data);
    } catch (error) {
      console.error(`Помилка при оновленні розкладу потяга з ID ${id}:`, error);
      throw error;
    }
  }

  public async deleteTrainSchedule(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Помилка при видаленні розкладу потяга з ID ${id}:`, error);
      throw error;
    }
  }

  public validateDatesOrder(departureDateTime: string, arrivalDateTime: string): boolean {
    const departureDate = new Date(departureDateTime);
    const arrivalDate = new Date(arrivalDateTime);
    return departureDate <= arrivalDate;
  }

  public formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    } catch {
      return '--.--.----';
    }
  }

  public formatTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return '--:--';
    }
  }

  public formatDateTime(dateString: string): string {
    try {
      const formattedDate = this.formatDate(dateString);
      const formattedTime = this.formatTime(dateString);
      return `${formattedDate} ${formattedTime}`;
    } catch {
      return '--.--.---- --:--';
    }
  }
}

export const trainScheduleService = new TrainScheduleService(); 