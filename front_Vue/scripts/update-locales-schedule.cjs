const fs = require('fs');
const path = require('path');

const locales = ['ko', 'en', 'es', 'ja', 'zh-TW', 'ru'];

const translations = {
  ko: {
    events: {
      status: { live: "진행 중", upcoming: "예정", completed: "종료", allCompleted: "오늘의 모든 일정이 종료되었습니다." },
      time: { startsIn: "{h}시간 {m}분 후 시작", startsInMin: "{m}분 후 시작", startsSoon: "곧 시작", inProgress: "진행 중", ended: "종료됨" }
    },
    homeV2: { currentProgram: "현재 진행 중", nextProgram: "다음 일정", noCurrentProgram: "현재 진행 중인 일정이 없습니다." }
  },
  en: {
    events: {
      status: { live: "Live", upcoming: "Upcoming", completed: "Ended", allCompleted: "All sessions for today have concluded." },
      time: { startsIn: "Starts in {h}h {m}m", startsInMin: "Starts in {m}m", startsSoon: "Starting soon", inProgress: "In progress", ended: "Ended" }
    },
    homeV2: { currentProgram: "Current Program", nextProgram: "Next Program", noCurrentProgram: "No programs currently in progress." }
  },
  es: {
    events: {
      status: { live: "En vivo", upcoming: "Próximo", completed: "Terminado", allCompleted: "Todas las sesiones de hoy han concluido." },
      time: { startsIn: "Comienza en {h}h {m}m", startsInMin: "Comienza en {m}m", startsSoon: "Comienza pronto", inProgress: "En curso", ended: "Terminado" }
    },
    homeV2: { currentProgram: "Programa actual", nextProgram: "Próximo programa", noCurrentProgram: "No hay programas en curso." }
  },
  ja: {
    events: {
      status: { live: "進行中", upcoming: "予定", completed: "終了", allCompleted: "本日のすべてのセッションが終了しました。" },
      time: { startsIn: "{h}時間{m}分後に開始", startsInMin: "{m}分後に開始", startsSoon: "まもなく開始", inProgress: "進行中", ended: "終了" }
    },
    homeV2: { currentProgram: "現在のプログラム", nextProgram: "次回のプログラム", noCurrentProgram: "現在進行中のプログラムはありません。" }
  },
  'zh-TW': {
    events: {
      status: { live: "進行中", upcoming: "待開始", completed: "已結束", allCompleted: "今日所有課程已結束。" },
      time: { startsIn: "{h} 小時 {m} 分鐘後開始", startsInMin: "{m} 分鐘後開始", startsSoon: "即將開始", inProgress: "進行中", ended: "已結束" }
    },
    homeV2: { currentProgram: "目前節目", nextProgram: "下一個節目", noCurrentProgram: "目前沒有正在進行的節目。" }
  },
  ru: {
    events: {
      status: { live: "В эфире", upcoming: "Предстоящие", completed: "Завершено", allCompleted: "Все сессии на сегодня завершены." },
      time: { startsIn: "Начнется через {h} ч. {m} мин.", startsInMin: "Начнется через {m} мин.", startsSoon: "Скоро начнется", inProgress: "В процессе", ended: "Завершено" }
    },
    homeV2: { currentProgram: "Текущая программа", nextProgram: "Следующая программа", noCurrentProgram: "В данный момент программ нет." }
  }
};

locales.forEach(lang => {
  // Update events.json
  const eventsPath = path.resolve(__dirname, `../src/i18n/locales/${lang}/events.json`);
  if (fs.existsSync(eventsPath)) {
    let data = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
    data.status = { ...data.status, ...translations[lang].events.status };
    data.time = { ...data.time, ...translations[lang].events.time };
    fs.writeFileSync(eventsPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${eventsPath}`);
  }

  // Update homeV2.json
  const homePath = path.resolve(__dirname, `../src/i18n/locales/${lang}/homeV2.json`);
  if (fs.existsSync(homePath)) {
    let data = JSON.parse(fs.readFileSync(homePath, 'utf8'));
    Object.assign(data, translations[lang].homeV2);
    fs.writeFileSync(homePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${homePath}`);
  }
});
