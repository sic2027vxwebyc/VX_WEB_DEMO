/**
 * [Booking Service]
 * 예약 및 체크인 API 호출
 */
import { api } from './api';

export const bookingService = {
  async fetchHotelReservation() { return await api.get('/booking/hotel'); },
  async checkinHotel() { return await api.post('/booking/hotel/checkin'); },
  async fetchMealReservation() { return await api.get('/booking/meal'); },
  async pickupMeal() { return await api.post('/booking/meal/pickup'); }
};
