export * from './api-types';

import { ApiService } from './api-service';
import { TrainScheduleService, trainScheduleService } from './train-schedule-service';
import { StationService, stationService } from './station-service';

const apiService = new ApiService();

export { 
  apiService, 
  ApiService, 
  TrainScheduleService, 
  trainScheduleService,
  StationService,
  stationService 
}; 