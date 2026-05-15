import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useSpacesStore = defineStore('spaces', () => {
  const { t } = useI18n()

  const rawSpaces = ref([
    // 제1전시장
    { id: 'hall-1', floorId: 'hall1', category: 'exhibition', zoneKey: 'hall-1.zone', area: '10,611㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdYQtmnyiohEctVcHmYWfhTpcPS7tpgyXLNx4RYwd_P4eIWxD9xRSvW0xRqnY9XKdYafmzTT1UD-QCE6zjGb8Klo9Hof5Q6qz0XUwr_QNpqoAbP_g9nLt2wugp4m_MLqBqlJk1flL_Q3mnCudNkJt1LKicBzQtmiqn8VzgdbInJwB0lYcy2PS-8rGzBQ9gYya2ZpBYOC1h4K0DXPXOn_kYIvUrZ4PFZ_RA4jVB5xU1kJiobq3Y2DPtFoYiaKzeida-joLizdKLOoGb', distance: 50, congestionType: 'low' },
    { id: 'hall-2', floorId: 'hall1', category: 'exhibition', zoneKey: 'hall-2.zone', area: '10,773㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzDvR_Btu4cAH2vK70MqFiySy8weC6GlLHs5saTodgmcUCnajxPhpZvEFS2T8oyTZMbK4Gwquye3rLYHjL54-iRbb3c80bueccPpiw1BU8JF0M06yQ7k9YJcT_J6GjOCx5szx2F5tR5G_jh6gAN69pMFVWlW93noucEdqx8neR-xFIbUp8B4YDFz1mHQdfYk12gJPsW_gkYLnaW7wK4obavXYUxWlCnznNzUKGC8KOsAjJhKar55d67Dbj9n0LtYrvR0rDUfRcuS2s', distance: 120, congestionType: 'moderate' },
    { id: 'hall-3', floorId: 'hall1', category: 'exhibition', zoneKey: 'hall-3.zone', area: '10,773㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzqlzcIm45ASPGmgRMInnTIKyJUUR_744-Fxo5Ia9zaPvaRJp6t88FJrjshi-zEJVjjH56M0NJZcTJO2_wT51Qe7TvJkIHonFlaTwzWYcp5xTAcGptKoZ6YlUzEFu3gilktRqV7Wxh6qIxCvUjBcX1yJW1KMxG2fInDUe4oK16iDwgk2dv4FmZcwM591hThOuRALZpjtKsw7a7Dvm5nq-iCRE5w6436FHeNSdA0VlHOoPuoRvLl19eLInfv2lF2GO1JNiVnbwFUQc5', distance: 200, congestionType: 'high' },
    { id: 'hall-4', floorId: 'hall1', category: 'exhibition', zoneKey: 'hall-4.zone', area: '10,773㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxcsky0qPhn1VqhcDQvLVbkTtZh2gNzgMfr_lRr3MJB9ZsCAmcNryXoGSDeI8ydcZdYSJ3sJN6Z_KpYs--b7_vqdRAueR7VHy6OXyiTMvslNSpu2d_gWsHlQjdX0ZiloNwJNcHKc61hpAJfGNi9rZYpCZhBaYt8V-oLgbSbRUnygGTaNUfpMUEMmbD0gWSE_IJBvxkEwDwWGVky642sXmnt1MtEkRW5CF4t2AbKnt1eEIPzjR1JEXn-LKeOsj8B45mdUGkIx5IhzWQ', distance: 280, congestionType: 'low' },
    { id: 'hall-5', floorId: 'hall1', category: 'exhibition', zoneKey: 'hall-5.zone', area: '10,611㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdYQtmnyiohEctVcHmYWfhTpcPS7tpgyXLNx4RYwd_P4eIWxD9xRSvW0xRqnY9XKdYafmzTT1UD-QCE6zjGb8Klo9Hof5Q6qz0XUwr_QNpqoAbP_g9nLt2wugp4m_MLqBqlJk1flL_Q3mnCudNkJt1LKicBzQtmiqn8VzgdbInJwB0lYcy2PS-8rGzBQ9gYya2ZpBYOC1h4K0DXPXOn_kYIvUrZ4PFZ_RA4jVB5xU1kJiobq3Y2DPtFoYiaKzeida-joLizdKLOoGb', distance: 350, congestionType: 'moderate' },
    
    // 제2전시장
    { id: 'hall-6', floorId: 'hall2', category: 'exhibition', zoneKey: 'hall-6.zone', area: '5,580㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzDvR_Btu4cAH2vK70MqFiySy8weC6GlLHs5saTodgmcUCnajxPhpZvEFS2T8oyTZMbK4Gwquye3rLYHjL54-iRbb3c80bueccPpiw1BU8JF0M06yQ7k9YJcT_J6GjOCx5szx2F5tR5G_jh6gAN69pMFVWlW93noucEdqx8neR-xFIbUp8B4YDFz1mHQdfYk12gJPsW_gkYLnaW7wK4obavXYUxWlCnznNzUKGC8KOsAjJhKar55d67Dbj9n0LtYrvR0rDUfRcuS2s', distance: 600, congestionType: 'low' },
    { id: 'hall-7', floorId: 'hall2', category: 'exhibition', zoneKey: 'hall-7.zone', area: '11,290㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzqlzcIm45ASPGmgRMInnTIKyJUUR_744-Fxo5Ia9zaPvaRJp6t88FJrjshi-zEJVjjH56M0NJZcTJO2_wT51Qe7TvJkIHonFlaTwzWYcp5xTAcGptKoZ6YlUzEFu3gilktRqV7Wxh6qIxCvUjBcX1yJW1KMxG2fInDUe4oK16iDwgk2dv4FmZcwM591hThOuRALZpjtKsw7a7Dvm5nq-iCRE5w6436FHeNSdA0VlHOoPuoRvLl19eLInfv2lF2GO1JNiVnbwFUQc5', distance: 680, congestionType: 'moderate' },
    { id: 'hall-8', floorId: 'hall2', category: 'exhibition', zoneKey: 'hall-8.zone', area: '11,290㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxcsky0qPhn1VqhcDQvLVbkTtZh2gNzgMfr_lRr3MJB9ZsCAmcNryXoGSDeI8ydcZdYSJ3sJN6Z_KpYs--b7_vqdRAueR7VHy6OXyiTMvslNSpu2d_gWsHlQjdX0ZiloNwJNcHKc61hpAJfGNi9rZYpCZhBaYt8V-oLgbSbRUnygGTaNUfpMUEMmbD0gWSE_IJBvxkEwDwWGVky642sXmnt1MtEkRW5CF4t2AbKnt1eEIPzjR1JEXn-LKeOsj8B45mdUGkIx5IhzWQ', distance: 750, congestionType: 'high' },
    { id: 'hall-9', floorId: 'hall2', category: 'exhibition', zoneKey: 'hall-9.zone', area: '13,238㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdYQtmnyiohEctVcHmYWfhTpcPS7tpgyXLNx4RYwd_P4eIWxD9xRSvW0xRqnY9XKdYafmzTT1UD-QCE6zjGb8Klo9Hof5Q6qz0XUwr_QNpqoAbP_g9nLt2wugp4m_MLqBqlJk1flL_Q3mnCudNkJt1LKicBzQtmiqn8VzgdbInJwB0lYcy2PS-8rGzBQ9gYya2ZpBYOC1h4K0DXPXOn_kYIvUrZ4PFZ_RA4jVB5xU1kJiobq3Y2DPtFoYiaKzeida-joLizdKLOoGb', distance: 820, congestionType: 'low' },
    { id: 'hall-10', floorId: 'hall2', category: 'exhibition', zoneKey: 'hall-10.zone', area: '13,072㎡', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzDvR_Btu4cAH2vK70MqFiySy8weC6GlLHs5saTodgmcUCnajxPhpZvEFS2T8oyTZMbK4Gwquye3rLYHjL54-iRbb3c80bueccPpiw1BU8JF0M06yQ7k9YJcT_J6GjOCx5szx2F5tR5G_jh6gAN69pMFVWlW93noucEdqx8neR-xFIbUp8B4YDFz1mHQdfYk12gJPsW_gkYLnaW7wK4obavXYUxWlCnznNzUKGC8KOsAjJhKar55d67Dbj9n0LtYrvR0rDUfRcuS2s', distance: 900, congestionType: 'moderate' },

    // 식당/카페
    { id: 'f-sodam', floorId: 'hall1', category: 'dining', zoneKey: 'f-sodam.zone', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj7CrFH2zoIAX8IGHYtZSmxIpsNtxdOnvBB9dO1YysevtS3XmcCAcvJnHV5EAHEXSAUN-A_6ewE50VzpF9MN0xw5hKtVqhFmJ1_Rx1asaUfvYVPtcxBcEKrRMtI827WOCocsH-th7_jUieLNCNyjkc1OiBu8G0g0fJEk_N7uff80HR-FWv2LG_EgkgwIGtvcoGvrYR7U2MqE959yXQbwHjQ38v-YMX2DOWL4sNMqx0w_B4jZMm1WBd-xUOYxiuFKDugZLIhMKcxcb0', distance: 80, congestionType: 'moderate' },
    { id: 'f-benvenuto', floorId: 'hall1', category: 'dining', zoneKey: 'f-benvenuto.zone', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj7CrFH2zoIAX8IGHYtZSmxIpsNtxdOnvBB9dO1YysevtS3XmcCAcvJnHV5EAHEXSAUN-A_6ewE50VzpF9MN0xw5hKtVqhFmJ1_Rx1asaUfvYVPtcxBcEKrRMtI827WOCocsH-th7_jUieLNCNyjkc1OiBu8G0g0fJEk_N7uff80HR-FWv2LG_EgkgwIGtvcoGvrYR7U2MqE959yXQbwHjQ38v-YMX2DOWL4sNMqx0w_B4jZMm1WBd-xUOYxiuFKDugZLIhMKcxcb0', distance: 150, congestionType: 'low' },
    { id: 'f-myeongdong', floorId: 'hall2', category: 'dining', zoneKey: 'f-myeongdong.zone', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj7CrFH2zoIAX8IGHYtZSmxIpsNtxdOnvBB9dO1YysevtS3XmcCAcvJnHV5EAHEXSAUN-A_6ewE50VzpF9MN0xw5hKtVqhFmJ1_Rx1asaUfvYVPtcxBcEKrRMtI827WOCocsH-th7_jUieLNCNyjkc1OiBu8G0g0fJEk_N7uff80HR-FWv2LG_EgkgwIGtvcoGvrYR7U2MqE959yXQbwHjQ38v-YMX2DOWL4sNMqx0w_B4jZMm1WBd-xUOYxiuFKDugZLIhMKcxcb0', distance: 650, congestionType: 'high' },
    
    // 편의시설
    { id: 'c-cu1', floorId: 'hall1', category: 'amenities', zoneKey: 'c-cu1.zone', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj7CrFH2zoIAX8IGHYtZSmxIpsNtxdOnvBB9dO1YysevtS3XmcCAcvJnHV5EAHEXSAUN-A_6ewE50VzpF9MN0xw5hKtVqhFmJ1_Rx1asaUfvYVPtcxBcEKrRMtI827WOCocsH-th7_jUieLNCNyjkc1OiBu8G0g0fJEk_N7uff80HR-FWv2LG_EgkgwIGtvcoGvrYR7U2MqE959yXQbwHjQ38v-YMX2DOWL4sNMqx0w_B4jZMm1WBd-xUOYxiuFKDugZLIhMKcxcb0', distance: 100, congestionType: 'low' },
    { id: 'c-press', floorId: 'hall1', category: 'amenities', zoneKey: 'c-press.zone', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj7CrFH2zoIAX8IGHYtZSmxIpsNtxdOnvBB9dO1YysevtS3XmcCAcvJnHV5EAHEXSAUN-A_6ewE50VzpF9MN0xw5hKtVqhFmJ1_Rx1asaUfvYVPtcxBcEKrRMtI827WOCocsH-th7_jUieLNCNyjkc1OiBu8G0g0fJEk_N7uff80HR-FWv2LG_EgkgwIGtvcoGvrYR7U2MqE959yXQbwHjQ38v-YMX2DOWL4sNMqx0w_B4jZMm1WBd-xUOYxiuFKDugZLIhMKcxcb0', distance: 180, congestionType: 'low' },
    
    // 제휴호텔
    { id: 'h-sonocalm', floorId: 'external', category: 'hotels', zoneKey: 'h-sonocalm.zone', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj7CrFH2zoIAX8IGHYtZSmxIpsNtxdOnvBB9dO1YysevtS3XmcCAcvJnHV5EAHEXSAUN-A_6ewE50VzpF9MN0xw5hKtVqhFmJ1_Rx1asaUfvYVPtcxBcEKrRMtI827WOCocsH-th7_jUieLNCNyjkc1OiBu8G0g0fJEk_N7uff80HR-FWv2LG_EgkgwIGtvcoGvrYR7U2MqE959yXQbwHjQ38v-YMX2DOWL4sNMqx0w_B4jZMm1WBd-xUOYxiuFKDugZLIhMKcxcb0', distance: 2000, congestionType: 'low' },
    { id: 'h-gloucester', floorId: 'external', category: 'hotels', zoneKey: 'h-gloucester.zone', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj7CrFH2zoIAX8IGHYtZSmxIpsNtxdOnvBB9dO1YysevtS3XmcCAcvJnHV5EAHEXSAUN-A_6ewE50VzpF9MN0xw5hKtVqhFmJ1_Rx1asaUfvYVPtcxBcEKrRMtI827WOCocsH-th7_jUieLNCNyjkc1OiBu8G0g0fJEk_N7uff80HR-FWv2LG_EgkgwIGtvcoGvrYR7U2MqE959yXQbwHjQ38v-YMX2DOWL4sNMqx0w_B4jZMm1WBd-xUOYxiuFKDugZLIhMKcxcb0', distance: 300, congestionType: 'low' }
  ])

  /**
   * 번역된 데이터를 포함한 공간 목록
   * computed를 사용하여 언어 변경 시 자동으로 갱신됩니다.
   */
  const spaces = computed(() => {
    return rawSpaces.value.map(s => ({
      ...s,
      name: t(`spaces.${s.id}.name`),
      zone: t(`spaces.${s.id}.zone`),
      description: t(`spaces.${s.id}.description`),
      tags: t(`spaces.${s.id}.tags`, { defaultValue: [] }),
      congestion: t(`spaces.congestion.${s.congestionType}`)
    }))
  })

  const categories = ['all', 'exhibition', 'dining', 'amenities', 'hotels']

  const getSpaceById = (id) => {
    return spaces.value.find(s => s.id === id)
  }

  return {
    spaces,
    categories,
    getSpaceById
  }
})
