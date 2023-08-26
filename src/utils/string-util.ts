export function splitStringByComma(inputString: string) {
  const resultArray = inputString.split(',');
  return resultArray;
}

export const seoulRegionList = [
  '강남',
  '서초',
  '잠실/송파/강동',
  '영등포/여의도/강서',
  '건대/성수/왕십리',
  '종로/중구',
  '홍대/합정/마포',
  '용산/이태원/한남',
  '성북/노원/중랑',
  '구로/관악/동작',
];

export function isDateCloseDay(date: string, closeDay: string) {
  const pattern =
    /^(매주\s+)?(첫째주|둘째주|셋째주|넷째주)\s+(월|화|수|목|금|토|일)(\/(월|화|수|목|금|토|일))*$|^월\/화\/수\/목\/금\/토\/일$/;
  return pattern.test(closeDay);
}
