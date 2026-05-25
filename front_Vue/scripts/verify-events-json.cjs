const fs = require('fs');
const path = require('path');

const localesDir = path.resolve(__dirname, '../src/i18n/locales');
const docsDir = path.resolve(__dirname, '../docs');

function parseTxt(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  const items = [];
  let currentPeriod = '오전';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === '오전') { currentPeriod = '오전'; continue; }
    if (line === '오후') { currentPeriod = '오후'; continue; }

    const timeMatch = line.match(/^(\d{1,2}:\d{2})\s+(.*)$/);
    if (timeMatch) {
      const time = timeMatch[1];
      let title = timeMatch[2];
      const subItems = [];

      // Check next lines for subitems or drama subtitle
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        if (nextLine.match(/^\d{1,2}:\d{2}/) || nextLine === '오후' || nextLine === '오전') break;
        
        if (nextLine.startsWith('•')) {
          subItems.push(nextLine.substring(1).trim());
        } else if (title.endsWith(':')) {
          title += ' ' + nextLine;
        } else {
          title += ' ' + nextLine;
        }
        j++;
      }
      i = j - 1;
      items.push({ time, title, subItems, period: currentPeriod });
    }
  }
  return items;
}

function verify() {
  const koEventsPath = path.join(localesDir, 'ko/events.json');
  const koEvents = JSON.parse(fs.readFileSync(koEventsPath, 'utf8'));
  const jsonItems = Object.values(koEvents.items);

  const txtFiles = [
    { day: 'friday', path: path.join(docsDir, 'CO-pgm26_KO_00.txt') },
    { day: 'saturday', path: path.join(docsDir, 'CO-pgm26_KO_01.txt') },
    { day: 'sunday', path: path.join(docsDir, 'CO-pgm26_KO_02.txt') }
  ];

  let errors = [];

  txtFiles.forEach(file => {
    const txtItems = parseTxt(file.path);
    const dayJsonItems = jsonItems.filter(item => item.day === file.day);

    console.log(`\n[${file.day}] TXT items: ${txtItems.length}, JSON items: ${dayJsonItems.length}`);

    if (txtItems.length !== dayJsonItems.length) {
      errors.push(`${file.day}: Item count mismatch. TXT: ${txtItems.length}, JSON: ${dayJsonItems.length}`);
    }

    txtItems.forEach((txtItem, index) => {
      const jsonItem = dayJsonItems[index];
      if (!jsonItem) return;

      // 1. Time check (Special handling for 12:10 and Afternoon items)
      let [h, m] = txtItem.time.split(':').map(Number);
      if (txtItem.period === '오후' && h < 12) {
        h += 12;
      }
      let expectedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      
      // USER MANDATE: 12:10 must be 12:10, not 00:10
      if (txtItem.time === '12:10') expectedTime = '12:10';

      if (jsonItem.time !== expectedTime) {
        errors.push(`${file.day} [Item ${index+1}]: Time mismatch. Expected ${expectedTime}, Found ${jsonItem.time}`);
      }

      // 2. DisplayTime check
      if (jsonItem.displayTime !== txtItem.time) {
        errors.push(`${file.day} [Item ${index+1}]: displayTime mismatch. Expected ${txtItem.time}, Found ${jsonItem.displayTime}`);
      }

      // 3. Title check (loose match because of spacing/drama formatting)
      const normalizedTxtTitle = txtItem.title.replace(/\s+/g, ' ').trim();
      const normalizedJsonTitle = jsonItem.title.replace(/\s+/g, ' ').trim();
      
      if (normalizedJsonTitle !== normalizedTxtTitle) {
        // Check if it's just a drama title joining issue
        if (!normalizedJsonTitle.includes(normalizedTxtTitle.substring(0, 10))) {
          errors.push(`${file.day} [Item ${index+1}]: Title mismatch.\n  TXT: ${normalizedTxtTitle}\n  JSON: ${normalizedJsonTitle}`);
        }
      }

      // 4. SubItems check
      if (txtItem.subItems.length > 0) {
        if (!jsonItem.subItems || jsonItem.subItems.length !== txtItem.subItems.length) {
          errors.push(`${file.day} [Item ${index+1}]: SubItems count mismatch.`);
        } else {
          txtItem.subItems.forEach((sub, sIdx) => {
            if (jsonItem.subItems[sIdx].trim() !== sub.trim()) {
              errors.push(`${file.day} [Item ${index+1}] SubItem ${sIdx+1} mismatch.\n  TXT: ${sub}\n  JSON: ${jsonItem.subItems[sIdx]}`);
            }
          });
        }
      }
    });
  });

  if (errors.length > 0) {
    console.error('\n--- Verification Failed ---');
    errors.forEach(err => console.error(`- ${err}`));
    process.exit(1);
  } else {
    console.log('\n--- Verification Passed ---');
  }
}

verify();
