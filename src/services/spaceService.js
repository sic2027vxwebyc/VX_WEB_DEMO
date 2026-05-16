/**
 * 공간 관련 데이터 서비스
 * 서버 API 통신 또는 로컬 데이터 소스 관리를 담당합니다.
 */
export const spaceService = {
  /**
   * 전체 공간 목록을 조회합니다.
   * @returns {Promise<Array>} 공간 목록 배열
   */
  async getSpaces() {
    // 실제 환경에서는 axios.get('/api/spaces') 등을 사용합니다.
    // 현재는 고화질 4K/8K 360 파노라마 데이터를 반환합니다.
    return [
      // 제1전시장 (4K+ 고화질 파노라마)
      { 
        id: 'hall-1', 
        nameKey: 'spaces.hall1.name',
        descriptionKey: 'spaces.hall1.description',
        shortNameKey: 'spaces.hall1.shortName',
        locationKey: 'spaces.hall1.location',
        zoneKey: 'spaces.hall1.zone',
        floorId: 'hall1', 
        category: 'exhibition', 
        area: '10,611㎡', 
        image: 'https://images.unsplash.com/photo-1557971370-e7298ee473fb?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://prium.github.io/360-view/img/scifi.jpg', 
        distance: 50, 
        congestionType: 'low' 
      },
      { 
        id: 'hall-2', 
        nameKey: 'spaces.hall2.name',
        descriptionKey: 'spaces.hall2.description',
        shortNameKey: 'spaces.hall2.shortName',
        locationKey: 'spaces.hall2.location',
        zoneKey: 'spaces.hall2.zone',
        floorId: 'hall1', 
        category: 'exhibition', 
        area: '10,773㎡', 
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://pannellum.org/images/alma.jpg',
        distance: 120, 
        congestionType: 'moderate' 
      },
      { 
        id: 'hall-3', 
        nameKey: 'spaces.hall3.name',
        descriptionKey: 'spaces.hall3.description',
        shortNameKey: 'spaces.hall3.shortName',
        locationKey: 'spaces.hall3.location',
        zoneKey: 'spaces.hall3.zone',
        floorId: 'hall1', 
        category: 'exhibition', 
        area: '10,773㎡', 
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://pannellum.org/images/jfk.jpg',
        distance: 200, 
        congestionType: 'high' 
      },
      { 
        id: 'hall-4', 
        nameKey: 'spaces.hall4.name',
        descriptionKey: 'spaces.hall4.description',
        shortNameKey: 'spaces.hall4.shortName',
        locationKey: 'spaces.hall4.location',
        zoneKey: 'spaces.hall4.zone',
        floorId: 'hall1', 
        category: 'exhibition', 
        area: '10,773㎡', 
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://pannellum.org/images/m_and_m.jpg',
        distance: 280, 
        congestionType: 'low' 
      },
      { 
        id: 'hall-5', 
        nameKey: 'spaces.hall5.name',
        descriptionKey: 'spaces.hall5.description',
        shortNameKey: 'spaces.hall5.shortName',
        locationKey: 'spaces.hall5.location',
        zoneKey: 'spaces.hall5.zone',
        floorId: 'hall1', 
        category: 'exhibition', 
        area: '10,611㎡', 
        image: 'https://images.unsplash.com/photo-1517502884422-41eaadeff171?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://pannellum.org/images/cerro-tolo-s.jpg',
        distance: 350, 
        congestionType: 'moderate' 
      },
      
      // 제2전시장
      { 
        id: 'hall-6', 
        nameKey: 'spaces.hall6.name',
        descriptionKey: 'spaces.hall6.description',
        shortNameKey: 'spaces.hall6.shortName',
        locationKey: 'spaces.hall6.location',
        zoneKey: 'spaces.hall6.zone',
        floorId: 'hall2', 
        category: 'exhibition', 
        area: '5,580㎡', 
        image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://threejs.org/examples/textures/2294472375_b9a84c0c34_k.jpg',
        distance: 600, 
        congestionType: 'low' 
      },
      { 
        id: 'hall-7', 
        nameKey: 'spaces.hall7.name',
        descriptionKey: 'spaces.hall7.description',
        shortNameKey: 'spaces.hall7.shortName',
        locationKey: 'spaces.hall7.location',
        zoneKey: 'spaces.hall7.zone',
        floorId: 'hall2', 
        category: 'exhibition', 
        area: '11,290㎡', 
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://threejs.org/examples/textures/equirectangular.png',
        distance: 680, 
        congestionType: 'moderate' 
      },
      { 
        id: 'hall-8', 
        nameKey: 'spaces.hall8.name',
        descriptionKey: 'spaces.hall8.description',
        shortNameKey: 'spaces.hall8.shortName',
        locationKey: 'spaces.hall8.location',
        zoneKey: 'spaces.hall8.zone',
        floorId: 'hall2', 
        category: 'exhibition', 
        area: '11,290㎡', 
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=4000&auto=format&fit=crop', 
        distance: 750, 
        congestionType: 'high' 
      },
      { 
        id: 'hall-9', 
        nameKey: 'spaces.hall9.name',
        descriptionKey: 'spaces.hall9.description',
        shortNameKey: 'spaces.hall9.shortName',
        locationKey: 'spaces.hall9.location',
        zoneKey: 'spaces.hall9.zone',
        floorId: 'hall2', 
        category: 'exhibition', 
        area: '13,238㎡', 
        image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=4000&auto=format&fit=crop', 
        distance: 820, 
        congestionType: 'low' 
      },
      { 
        id: 'hall-10', 
        nameKey: 'spaces.hall10.name',
        descriptionKey: 'spaces.hall10.description',
        shortNameKey: 'spaces.hall10.shortName',
        locationKey: 'spaces.hall10.location',
        zoneKey: 'spaces.hall10.zone',
        floorId: 'hall2', 
        category: 'exhibition', 
        area: '13,072㎡', 
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=4000&auto=format&fit=crop', 
        distance: 900, 
        congestionType: 'moderate' 
      },
  
      // 식당/카페 (고화질 4K)
      { 
        id: 'f-sodam', 
        nameKey: 'spaces.fSodam.name',
        descriptionKey: 'spaces.fSodam.description',
        shortNameKey: 'spaces.fSodam.shortName',
        locationKey: 'spaces.fSodam.location',
        zoneKey: 'spaces.fSodam.zone',
        floorId: 'hall1', 
        category: 'dining', 
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=4000&auto=format&fit=crop',
        panoUrl: 'https://prium.github.io/360-view/img/hotel.jpg',
        distance: 80, 
        congestionType: 'moderate' 
      },
      { 
        id: 'f-benvenuto', 
        nameKey: 'spaces.fBenvenuto.name',
        descriptionKey: 'spaces.fBenvenuto.description',
        shortNameKey: 'spaces.fBenvenuto.shortName',
        locationKey: 'spaces.fBenvenuto.location',
        zoneKey: 'spaces.fBenvenuto.zone',
        floorId: 'hall1', 
        category: 'dining', 
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=4000&auto=format&fit=crop', 
        distance: 150, 
        congestionType: 'low' 
      },
      { 
        id: 'f-myeongdong', 
        nameKey: 'spaces.fMyeongdong.name',
        descriptionKey: 'spaces.fMyeongdong.description',
        shortNameKey: 'spaces.fMyeongdong.shortName',
        locationKey: 'spaces.fMyeongdong.location',
        zoneKey: 'spaces.fMyeongdong.zone',
        floorId: 'hall2', 
        category: 'dining', 
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=4000&auto=format&fit=crop', 
        distance: 650, 
        congestionType: 'high' 
      },
      
      // 편의시설
      { 
        id: 'c-cu1', 
        nameKey: 'spaces.cCu1.name',
        descriptionKey: 'spaces.cCu1.description',
        shortNameKey: 'spaces.cCu1.shortName',
        locationKey: 'spaces.cCu1.location',
        zoneKey: 'spaces.cCu1.zone',
        floorId: 'hall1', 
        category: 'amenities', 
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=4000&auto=format&fit=crop', 
        distance: 100, 
        congestionType: 'low' 
      },
      { 
        id: 'c-press', 
        nameKey: 'spaces.cPress.name',
        descriptionKey: 'spaces.cPress.description',
        shortNameKey: 'spaces.cPress.shortName',
        locationKey: 'spaces.cPress.location',
        zoneKey: 'spaces.cPress.zone',
        floorId: 'hall1', 
        category: 'amenities', 
        image: 'https://images.unsplash.com/photo-1557425955-df376b5903c8?q=80&w=4000&auto=format&fit=crop', 
        distance: 180, 
        congestionType: 'low' 
      },
      { 
        id: 'medical', 
        nameKey: 'spaces.medical.name',
        descriptionKey: 'spaces.medical.description',
        shortNameKey: 'spaces.medical.shortName',
        locationKey: 'spaces.medical.location',
        zoneKey: 'spaces.medical.zone',
        floorId: 'hall1', 
        category: 'amenities', 
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=4000&auto=format&fit=crop', 
        distance: 40, 
        congestionType: 'low' 
      },
      
      // 제휴호텔
      { 
        id: 'h-sonocalm', 
        nameKey: 'spaces.hSonocalm.name',
        descriptionKey: 'spaces.hSonocalm.description',
        shortNameKey: 'spaces.hSonocalm.shortName',
        locationKey: 'spaces.hSonocalm.location',
        zoneKey: 'spaces.hSonocalm.zone',
        floorId: 'external', 
        category: 'hotels', 
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=4000&auto=format&fit=crop', 
        distance: 2000, 
        congestionType: 'low' 
      },
      { 
        id: 'h-gloucester', 
        nameKey: 'spaces.hGloucester.name',
        descriptionKey: 'spaces.hGloucester.description',
        shortNameKey: 'spaces.hGloucester.shortName',
        locationKey: 'spaces.hGloucester.location',
        zoneKey: 'spaces.hGloucester.zone',
        floorId: 'external', 
        category: 'hotels', 
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=4000&auto=format&fit=crop', 
        distance: 300, 
        congestionType: 'low' 
      }
    ];
  }
}
