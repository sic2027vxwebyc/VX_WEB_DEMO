const fs = require('fs');
const path = require('path');

const locales = ['en', 'ja', 'zh-TW', 'es', 'ru'];
const files = ['admin.json', 'navigation.json'];
const sourceLocale = 'ko';

const translations = {
  en: {
    'gamification.logs.rewardStockAdjusted': '{id} stock adjusted: {delta} (remaining: {remaining})',
    'gamification.logs.rewardStatusChanged': '{id} status manually changed: {status}',
    'gamification.logs.questCreated': 'New dynamic quest created: {title}',
    'gamification.logs.questStatusChanged': 'Quest status changed: {id} -> {status}',
    'gamification.logs.questDeleted': 'Quest deleted: {id}',
    'gamification.logs.reset': 'Gamification data reset complete',
    'meals.logs.scanDetected': 'QR Scan Detected: {id}',
    'meals.logs.duplicateDetected': 'Duplicate Scan Detected: {name} ({id})',
    'meals.logs.pickupCompleted': 'Pickup Completed: {name} ({count} items)',
    'meals.logs.reset': 'Meal data reset complete',
    'meals.logs.notFound': 'Reservation information not found.',
    'hotel.logs.checkIn': 'Check-in Complete: {name} ({hotel} Room {room})',
    'hotel.logs.checkOut': 'Check-out Complete: {name} ({hotel} Room {room})',
    'hotel.logs.reset': 'Hotel operation data reset complete',
    'hotel.logs.notFound': 'Reservation information not found.',
    'security.logs.securityLogStatusChanged': 'Security log status changed: {id} -> {status}',
    'security.logs.deviceStatusUpdated': 'Device status updated: {id}',
    'security.logs.reset': 'Security & telemetry data reset complete',
    'operations.liveMonitoring': 'Live Monitoring Active',
    'operations.realTimeStream': 'Real-time Stream',
    'operations.engineActive': 'Operational Intelligence Active',
    'gamification.engineActive': 'Reward Engine Active',
    'gamification.participationTrend': 'Participation Trend',
    'gamification.noEvents': 'No Events',
    'gamification.logs.scannerSuccess': 'QR Scan Detected: {spot} (ID: {id})'
  },
  ja: {
    'gamification.logs.rewardStockAdjusted': '{id} 在庫調整: {delta} (残り: {remaining})',
    'gamification.logs.rewardStatusChanged': '{id} 状態手動変更: {status}',
    'gamification.logs.questCreated': '新規動적퀘스트 생성: {title}',
    'gamification.logs.questStatusChanged': '퀘스트 상태 변경: {id} -> {status}',
    'gamification.logs.questDeleted': '퀘스트 삭제: {id}',
    'gamification.logs.reset': 'ゲーミフィケーションデータ初期化完了',
    'meals.logs.scanDetected': 'QRスキャン検知: {id}',
    'meals.logs.duplicateDetected': '重複スキャン検知: {name} ({id})',
    'meals.logs.pickupCompleted': '受取完了: {name} ({count}個)',
    'meals.logs.reset': 'お弁当データ初期化完了',
    'meals.logs.notFound': '予約情報が見つかりません。',
    'hotel.logs.checkIn': 'チェック인 완료: {name} ({hotel} {room}호)',
    'hotel.logs.checkOut': 'チェック아웃 완료: {name} ({hotel} {room}호)',
    'hotel.logs.reset': 'ホテル運営データ初期化完了',
    'hotel.logs.notFound': '予約情報が見つかりません。',
    'security.logs.securityLogStatusChanged': 'セキュリティログ状態変更: {id} -> {status}',
    'security.logs.deviceStatusUpdated': '端末状態更新: {id}',
    'security.logs.reset': 'セキュリティ&テレメトリデータ初期化完了',
    'operations.liveMonitoring': 'リアルタイム監視中',
    'operations.realTimeStream': 'リアルタイムストリーム',
    'operations.engineActive': '運営インテリジェンス有効',
    'gamification.engineActive': 'リワードエンジン有効',
    'gamification.participationTrend': '参加推移',
    'gamification.noEvents': 'イベントなし',
    'gamification.logs.scannerSuccess': 'QRスキャン検知: {spot} (ID: {id})'
  },
  'zh-TW': {
    'gamification.logs.rewardStockAdjusted': '{id} 庫存調整: {delta} (剩餘: {remaining})',
    'gamification.logs.rewardStatusChanged': '{id} 狀態手動變更: {status}',
    'gamification.logs.questCreated': '新動態任務生成: {title}',
    'gamification.logs.questStatusChanged': '任務狀態變更: {id} -> {status}',
    'gamification.logs.questDeleted': '任務刪除: {id}',
    'gamification.logs.reset': '遊戲化數據重置完成',
    'meals.logs.scanDetected': 'QR 掃描檢測: {id}',
    'meals.logs.duplicateDetected': '重複掃描檢測: {name} ({id})',
    'meals.logs.pickupCompleted': '領取完成: {name} ({count}個)',
    'meals.logs.reset': '便當數據重置完成',
    'meals.logs.notFound': '找不到預約資訊。',
    'hotel.logs.checkIn': '入住完成: {name} ({hotel} {room}號房)',
    'hotel.logs.checkOut': '退房完成: {name} ({hotel} {room}號房)',
    'hotel.logs.reset': '飯店運營數據重置完成',
    'hotel.logs.notFound': '找不到預約資訊。',
    'security.logs.securityLogStatusChanged': '安全日誌狀態變更: {id} -> {status}',
    'security.logs.deviceStatusUpdated': '設備狀態更新: {id}',
    'security.logs.reset': '安全與數據重置完成',
    'operations.liveMonitoring': '即時監控中',
    'operations.realTimeStream': '即時串流',
    'operations.engineActive': '運營智慧引擎運作中',
    'gamification.engineActive': '獎勵引擎運作中',
    'gamification.participationTrend': '參與趨勢',
    'gamification.noEvents': '無事件',
    'gamification.logs.scannerSuccess': 'QR 掃描檢測: {spot} (ID: {id})'
  },
  es: {
    'gamification.logs.rewardStockAdjusted': '{id} stock ajustado: {delta} (restante: {remaining})',
    'gamification.logs.rewardStatusChanged': '{id} estado cambiado manualmente: {status}',
    'gamification.logs.questCreated': 'Nueva misión dinámica creada: {title}',
    'gamification.logs.questStatusChanged': 'Estado de misión cambiado: {id} -> {status}',
    'gamification.logs.questDeleted': 'Misión eliminada: {id}',
    'gamification.logs.reset': 'Datos de gamificación reiniciados',
    'meals.logs.scanDetected': 'Escaneo QR detectado: {id}',
    'meals.logs.duplicateDetected': 'Escaneo duplicado detectado: {name} ({id})',
    'meals.logs.pickupCompleted': 'Entrega completada: {name} ({count} items)',
    'meals.logs.reset': 'Datos de almuerzos reiniciados',
    'meals.logs.notFound': 'Información de reserva no encontrada.',
    'hotel.logs.checkIn': 'Check-in completado: {name} ({hotel} Hab. {room})',
    'hotel.logs.checkOut': 'Check-out completado: {name} ({hotel} Hab. {room})',
    'hotel.logs.reset': 'Datos de hoteles reiniciados',
    'hotel.logs.notFound': 'Información de reserva no encontrada.',
    'security.logs.securityLogStatusChanged': 'Estado de log de seguridad cambiado: {id} -> {status}',
    'security.logs.deviceStatusUpdated': 'Estado de dispositivo actualizado: {id}',
    'security.logs.reset': 'Datos de seguridad y telemetría reiniciados',
    'operations.liveMonitoring': 'Monitoreo en vivo activo',
    'operations.realTimeStream': 'Stream en tiempo real',
    'operations.engineActive': 'Inteligencia operativa activa',
    'gamification.engineActive': 'Motor de premios activo',
    'gamification.participationTrend': 'Tendencia de participación',
    'gamification.noEvents': 'Sin eventos',
    'gamification.logs.scannerSuccess': 'Escaneo QR detectado: {spot} (ID: {id})'
  },
  ru: {
    'gamification.logs.rewardStockAdjusted': '{id} запас изменен: {delta} (осталось: {remaining})',
    'gamification.logs.rewardStatusChanged': '{id} статус изменен вручную: {status}',
    'gamification.logs.questCreated': 'Создан новый квест: {title}',
    'gamification.logs.questStatusChanged': 'Статус квеста изменен: {id} -> {status}',
    'gamification.logs.questDeleted': 'Квест удален: {id}',
    'gamification.logs.reset': 'Данные геймификации сброшены',
    'meals.logs.scanDetected': 'QR-скан обнаружен: {id}',
    'meals.logs.duplicateDetected': 'Повторный скан: {name} ({id})',
    'meals.logs.pickupCompleted': 'Выдача завершена: {name} ({count} шт.)',
    'meals.logs.reset': 'Данные обедов сброшены',
    'meals.logs.notFound': 'Бронь не найдена.',
    'hotel.logs.checkIn': 'Заселение завершено: {name} ({hotel} Ном. {room})',
    'hotel.logs.checkOut': 'Выселение завершено: {name} ({hotel} Ном. {room})',
    'hotel.logs.reset': 'Данные отелей сброшены',
    'hotel.logs.notFound': 'Бронь не найдена.',
    'security.logs.securityLogStatusChanged': 'Статус лога безопасности изменен: {id} -> {status}',
    'security.logs.deviceStatusUpdated': 'Статус устройства обновлен: {id}',
    'security.logs.reset': 'Данные безопасности и телеметрии сброшены',
    'operations.liveMonitoring': 'Живой мониторинг активен',
    'operations.realTimeStream': 'Поток в реальном времени',
    'operations.engineActive': 'Операционный интеллект активен',
    'gamification.engineActive': 'Двигатель наград активен',
    'gamification.participationTrend': 'Тренд участия',
    'gamification.noEvents': 'Нет событий',
    'gamification.logs.scannerSuccess': 'QR-скан обнаружен: {spot} (ID: {id})'
  }
};

// Also include operations and notifications logs which were already in en but missing in others
const missingLogs = {
  ja: {
    'operations.logs.congestionChanged': '{id} 混雑設定変更: {level}',
    'operations.logs.congestionReset': '{id} 混雑手動設定解除',
    'operations.logs.accessChanged': '{id} 立入状態変更: {status}',
    'operations.logs.accessReset': '{id} 立入制限解除',
    'operations.logs.reset': '運営データ初期化 완료',
    'operations.logs.crowdedAction': '区域混雑。迂回ルート案内を推奨。',
    'notifications.logs.tickerCreated': '緊急ティッカー作成: {id}',
    'notifications.logs.tickerActivated': 'ティッカー有効化: {id}',
    'notifications.logs.tickerDeactivated': 'ティッカー無効化: {id}',
    'notifications.logs.tickerExpired': 'ティッカー強制期限切れ: {id}',
    'notifications.logs.sessionCreated': 'セッション変更通知作成: {id}',
    'notifications.logs.sessionSent': 'セッション変更通知送信: {id}',
    'notifications.logs.reset': '通知データ初期化完了'
  },
  'zh-TW': {
    'operations.logs.congestionChanged': '{id} 擁擠度設定變更: {level}',
    'operations.logs.congestionReset': '{id} 擁擠度手動設定解除',
    'operations.logs.accessChanged': '{id} 出入狀態變更: {status}',
    'operations.logs.accessReset': '{id} 出入管制解除',
    'operations.logs.reset': '運營數據重置完成',
    'operations.logs.crowdedAction': '區域擁擠。建議啟用分流路徑導引。',
    'notifications.logs.tickerCreated': '緊急跑馬燈生成: {id}',
    'notifications.logs.tickerActivated': '跑馬燈啟用: {id}',
    'notifications.logs.tickerDeactivated': '跑馬燈停用: {id}',
    'notifications.logs.tickerExpired': '跑馬燈強制過期: {id}',
    'notifications.logs.sessionCreated': '議程變更通知生成: {id}',
    'notifications.logs.sessionSent': '議程變更通知發送: {id}',
    'notifications.logs.reset': '通知數據重置完成'
  },
  es: {
    'operations.logs.congestionChanged': '{id} nivel de congestión cambiado: {level}',
    'operations.logs.congestionReset': '{id} control manual de congestión limpiado',
    'operations.logs.accessChanged': '{id} estado de acceso cambiado: {status}',
    'operations.logs.accessReset': '{id} restricción de acceso limpiada',
    'operations.logs.reset': 'Datos operativos reiniciados',
    'operations.logs.crowdedAction': 'Zona congestionada. Se recomienda desvío.',
    'notifications.logs.tickerCreated': 'Aviso urgente creado: {id}',
    'notifications.logs.tickerActivated': 'Aviso activado: {id}',
    'notifications.logs.tickerDeactivated': 'Aviso desactivado: {id}',
    'notifications.logs.tickerExpired': 'Aviso expirado por fuerza: {id}',
    'notifications.logs.sessionCreated': 'Notificación de cambio de sesión creada: {id}',
    'notifications.logs.sessionSent': 'Notificación de cambio de sesión enviada: {id}',
    'notifications.logs.reset': 'Datos de notificaciones reiniciados'
  },
  ru: {
    'operations.logs.congestionChanged': '{id} загруженность изменена: {level}',
    'operations.logs.congestionReset': '{id} ручное управление сброшено',
    'operations.logs.accessChanged': '{id} статус доступа изменен: {status}',
    'operations.logs.accessReset': '{id} ограничения доступа сняты',
    'operations.logs.reset': 'Операционные данные сброшены',
    'operations.logs.crowdedAction': 'Зона перегружена. Рекомендуется объезд.',
    'notifications.logs.tickerCreated': 'Срочная строка создана: {id}',
    'notifications.logs.tickerActivated': 'Строка активирована: {id}',
    'notifications.logs.tickerDeactivated': 'Строка деактивирована: {id}',
    'notifications.logs.tickerExpired': 'Срок строки принудительно истек: {id}',
    'notifications.logs.sessionCreated': 'Уведомление об изменении сессии создано: {id}',
    'notifications.logs.sessionSent': 'Уведомление об изменении сессии отправлено: {id}',
    'notifications.logs.reset': 'Данные уведомлений сброшены'
  }
};

files.forEach(file => {
  const sourcePath = path.join('src/i18n/locales', sourceLocale, file);
  if (!fs.existsSync(sourcePath)) return;
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  locales.forEach(locale => {
    const targetPath = path.join('src/i18n/locales', locale, file);
    if (!fs.existsSync(targetPath)) return;
    const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

    function sync(src, tgt, prefix = '', locale) {
      for (let key in src) {
        const fullKey = prefix + key;
        if (typeof src[key] === 'object' && src[key] !== null) {
          if (!tgt[key]) tgt[key] = {};
          sync(src[key], tgt[key], fullKey + '.', locale);
        } else {
          const val = tgt[key];
          const isTodo = typeof val === 'string' && val.includes('[TODO]');
          const isKorean = typeof val === 'string' && /[\uac00-\ud7af]/.test(val);
          const isEmpty = val === "" || val === null || val === undefined;

          if (isTodo || isKorean || isEmpty) {
             // Try to find translation
             if (translations[locale] && translations[locale][fullKey]) {
               tgt[key] = translations[locale][fullKey];
             } else if (missingLogs[locale] && missingLogs[locale][fullKey]) {
               tgt[key] = missingLogs[locale][fullKey];
             } else {
               // Force copy from source if still nothing, but only if it was [TODO] or empty
               if (isTodo || isEmpty) {
                 tgt[key] = src[key];
               }
             }
          }
        }
      }
    }

    sync(sourceData, targetData, '', locale);
    fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2), 'utf8');
    console.log(`Synced ${targetPath}`);
  });
});
