/**
 * Типи для модуля розкладу потягів
 */

/**
 * Тип для станції
 */
export interface Station {
  readonly id: string;
  readonly name: string;
  readonly city: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Тип для розкладу потягів
 */
export interface TrainSchedule {
  readonly id: string;
  readonly trainNumber: string;
  readonly departureStationId: string;
  readonly departureStation: Station;
  readonly arrivalStationId: string;
  readonly arrivalStation: Station;
  readonly departureTime: string;
  readonly arrivalTime: string;
  readonly departurePlatform?: number;
  readonly arrivalPlatform?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
} 