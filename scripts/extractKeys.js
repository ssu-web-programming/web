console.log('✅ 다국어 번역에서 누락된 키 찾기 ---------------------------------');

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const koPath = path.join(__dirname, '../src/locale/translation.ko.json');
const enPath = path.join(__dirname, '../src/locale/translation.en.json');
const jaPath = path.join(__dirname, '../src/locale/translation.ja.json');

const koTranslation = JSON.parse(fs.readFileSync(koPath, 'utf8'));
const enTranslation = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const jaTranslation = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

// 중첩 객체의 키 확인
function findMissingKeys(base, target, prefix = '') {
  let missingKeys = [];

  _.forOwn(base, (value, key) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (_.isPlainObject(value)) {
      missingKeys = missingKeys.concat(findMissingKeys(value, _.get(target, key, {}), newPrefix));
    } else if (!_.has(target, key)) {
      missingKeys.push(newPrefix);
    }
  });

  return missingKeys;
}

// 한국어 기준으로 누락된 키 찾기
const missingInEn = findMissingKeys(koTranslation, enTranslation);
const missingInJa = findMissingKeys(koTranslation, jaTranslation);

console.log('🔴 영어 번역에 누락된 키:', missingInEn);
console.log('🔴 일본어 번역에 누락된 키:', missingInJa);
