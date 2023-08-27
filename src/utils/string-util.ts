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
  if (!isValidCloseDay || closeDay === '없음') return false; //휴무일이 유효하지 않은 형식인 경우 처리

  const resultArray = closeDay.split(' ');
  const closeWeeks = resultArray[0].split('/'); //[매주]
  const closeDays = resultArray[1].split('/'); //[월,화]
  const closeWeeksAsNumbers = convertStringToNumber(closeWeeks, weekMap);
  const closeDaysAsNumbers = convertStringToNumber(closeDays, dayMap);
  console.log(closeDaysAsNumbers, closeWeeksAsNumbers);
  // date 파싱
  const dateParts = date.split(/[-/]/);
  const year = parseInt(dateParts[2], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[0], 10);

  // date를 Date 객체로 변환
  const dateObj = new Date(year, month, day);

  // date의 요일 추출 (0: 일요일, 1: 월요일, ...)
  const dayOfWeek = dateObj.getDay(); // 0부터 시작

  // date의 주차 추출 (1: 첫째주, 2: 둘째주, ...)
  // 한 주의 첫 번째 날이 월요일인 것을 가정
  const weekNumber = Math.ceil((day + 1) / 7);

  console.log(dayOfWeek); // 요일
  console.log(weekNumber); // 주차

  console.log(`요일: ${dayOfWeek}, 주차: ${weekNumber}`);

  // 1. closeWeeks가 매주인 경우에는 요일이 closeDays에 포함되는지만 확인한다. 아니면 false
  if (closeWeeksAsNumbers[0] === 0) {
    return closeDaysAsNumbers.includes(dayOfWeek); //요일 일치하면 true 반환
  } else {
    if (closeWeeksAsNumbers.includes(weekNumber)) {
      return closeDaysAsNumbers.includes(dayOfWeek);
    }
  }

  console.log('휴무일 아님');
  return false;
}

export function isValidCloseDay(closeDay: string) {
  if (closeDay === '없음') {
    return true;
  }
  const resultArray = closeDay.split(' ');
  const week = resultArray[0].split('/');
  const day = resultArray[1].split('/');
  if (week.includes('매주') && week.length >= 2) {
    return false;
  } else {
    for (var i = 0; i < week.length; i++) {
      if (
        week[i] !== '매주' &&
        week[i] !== '첫째주' &&
        week[i] !== '둘째주' &&
        week[i] !== '셋째주' &&
        week[i] !== '넷째주'
      ) {
        return false;
      }
    }
    for (var i = 0; i < day.length; i++) {
      if (
        day[i] != '월' &&
        day[i] != '화' &&
        day[i] != '수' &&
        day[i] != '목' &&
        day[i] != '금' &&
        day[i] != '토' &&
        day[i] != '일'
      ) {
        return false;
      }
    }
  }
  return true;
}

// 주차와 요일을 숫자로 매핑하는 맵
const weekMap: { [key: string]: number } = {
  매주: 0,
  첫째주: 1,
  둘째주: 2,
  셋째주: 3,
  넷째주: 4,
};

const dayMap: { [key: string]: number } = {
  일: 1,
  월: 2,
  화: 3,
  수: 4,
  목: 5,
  금: 6,
  토: 7,
};

// 문자열을 숫자로 변환하는 함수
function convertStringToNumber(
  inputArray: string[],
  map: { [key: string]: number }
): number[] {
  return inputArray.map((item) => map[item]);
}

export const isEmailValid = function (email: string): boolean {
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  return emailRegEx.test(email);
};

export const isPasswordValid = function (password: string): boolean {
  const passwordRegEx =
    /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
  return passwordRegEx.test(password);
};
