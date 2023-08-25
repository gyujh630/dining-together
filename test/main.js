document.addEventListener('DOMContentLoaded', () => {
  const a = document.querySelector('#a');

  fetch('http://18.190.7.141')
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response; // JSON 응답을 파싱합니다.
    })
    .then((data) => {
      // 파싱된 데이터를 사용합니다.
      console.log(data);
    })
    .catch((error) => {
      // 오류 처리
      console.error('There was a problem with the fetch operation:', error);
    });
});
