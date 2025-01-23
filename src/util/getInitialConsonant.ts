// 초성 추출 함수
const getInitialConsonant = (str: string) => {
  const initialConsonants = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ'
  ];

  const consonants = str
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0) - 44032;
      if (code > -1 && code < 11172) {
        return initialConsonants[Math.floor(code / 588)];
      }
      return char;
    })
    .join('');

  return consonants;
};

export default getInitialConsonant;
