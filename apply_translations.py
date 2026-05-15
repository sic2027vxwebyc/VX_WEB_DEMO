import json
import os

locales_dir = 'src/i18n/locales'

translations = {
    'ja': {
        'common': {
            "confirm": "確認", "cancel": "キャンセル", "save": "保存", "delete": "削除", "back": "戻る",
            "home": "ホーム", "settings": "設定", "search": "検索", "more": "もっと見る", "minutes": "分",
            "viewAll": "すべて表示", "details": "詳細", "viewDetails": "詳細を表示", "status": "ステータス", "live": "ライブ",
            "accessibility": { "점자 안내": "点字案内", "유도 루프": "磁気ループ", "휠체어 접근": "車椅子対応" }
        },
        'navigation': {
            "title": "ナビゲーション", "home": "ホーム", "explore": "探索", "map": "インタラクティブマップ",
            "events": "イベントスケジュール", "notifications": "通知センター", "admin": "管理者ダッシュボード",
            "settings": "設定", "help": "ヘルプ", "logout": "ログアウト", "newRoute": "新しいルートを作成",
            "globalNav": "グローバルナビゲーション", "spatialIntelligence": "VX 空間知能"
        }
    },
    'es': {
        'common': {
            "confirm": "Confirmar", "cancel": "Cancelar", "save": "Guardar", "delete": "Eliminar", "back": "Volver",
            "home": "Inicio", "settings": "Ajustes", "search": "Buscar", "more": "Más", "minutes": "min",
            "viewAll": "Ver todo", "details": "Detalles", "viewDetails": "Ver detalles", "status": "Estado", "live": "En vivo",
            "accessibility": { "점자 안내": "Guía en braille", "유도 루프": "Bucle de inducción", "휠체어 접근": "Acceso para sillas de ruedas" }
        },
        'navigation': {
            "title": "Navegación", "home": "Inicio", "explore": "Explorar", "map": "Mapa interactivo",
            "events": "Calendario de eventos", "notifications": "Centro de notificaciones", "admin": "Panel de administración",
            "settings": "Ajustes", "help": "Ayuda", "logout": "Cerrar sesión", "newRoute": "Crear nueva ruta",
            "globalNav": "Navegación global", "spatialIntelligence": "Inteligencia espacial VX"
        }
    },
    'ru': {
        'common': {
            "confirm": "Подтвердить", "cancel": "Отмена", "save": "Сохранить", "delete": "Удалить", "back": "Назад",
            "home": "Главная", "settings": "Настройки", "search": "Поиск", "more": "Еще", "minutes": "мин",
            "viewAll": "Показать все", "details": "Подробности", "viewDetails": "Посмотреть подробности", "status": "Статус", "live": "В эфире",
            "accessibility": { "점자 안내": "Шрифт Брайля", "유도 루프": "Индукционная петля", "휠체어 접근": "Доступ для инвалидных колясок" }
        },
        'navigation': {
            "title": "Навигация", "home": "Главная", "explore": "Исследовать", "map": "Интерактивная карта",
            "events": "Расписание мероприятий", "notifications": "Центр уведомлений", "admin": "Панель администратора",
            "settings": "Настройки", "help": "Помощь", "logout": "Выйти", "newRoute": "Создать новый маршрут",
            "globalNav": "Глобальная навигация", "spatialIntelligence": "Пространственный интеллект VX"
        }
    },
    'zh-TW': {
        'common': {
            "confirm": "確認", "cancel": "取消", "save": "儲存", "delete": "刪除", "back": "返回",
            "home": "首頁", "settings": "設定", "search": "搜尋", "more": "更多", "minutes": "分",
            "viewAll": "查看全部", "details": "詳情", "viewDetails": "查看詳情", "status": "狀態", "live": "即時",
            "accessibility": { "점자 안내": "點字指南", "유도 루프": "感應圈系統", "휠체어 접근": "輪椅通道" }
        },
        'navigation': {
            "title": "導航", "home": "首頁", "explore": "探索", "map": "互動地圖",
            "events": "活動行程", "notifications": "通知中心", "admin": "管理員控制台",
            "settings": "設定", "help": "說明", "logout": "登出", "newRoute": "建立新路線",
            "globalNav": "全域導航", "spatialIntelligence": "VX 空間智能"
        }
    }
}

def update_json(locale, domain, data):
    file_path = os.path.join(locales_dir, locale, f"{domain}.json")
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        current = json.load(f)
    
    # Simple recursive update
    def recursive_update(target, source):
        for k, v in source.items():
            if k in target:
                if isinstance(v, dict) and isinstance(target[k], dict):
                    recursive_update(target[k], v)
                else:
                    target[k] = v
                    
    recursive_update(current, data)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(current, f, indent=2, ensure_ascii=False)
        f.write('\n')

for locale, domains in translations.items():
    for domain, data in domains.items():
        update_json(locale, domain, data)
        print(f"Updated {locale}/{domain}.json with translations")
