/**
 * Експорт API сервісу та його типи для використання в додатку
 */

// Експорт типів API
export * from './api-types';

// Експорт API сервісу
import { ApiService } from './api-service';

// Створення екземпляру API сервісу для використання у всьому додатку
const apiService = new ApiService();

export { apiService, ApiService }; 