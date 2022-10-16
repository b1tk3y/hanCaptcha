/*
* 한글 초성, 중성, 종성별 자모 배열
*
* */
const choseong_list = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
  'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
  'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const jungseong_list = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
  'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
  'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const jongseong_list = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
  'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
  'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
  'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

const form = document.getElementById('form');
const error_div = document.getElementById('error');
const captcha_div = document.getElementById('hancaptcha');


function shuffle(array) {
  // 정답 자모와 노이즈 자모를 섞는다.
  array.sort(() => Math.random() - 0.5);
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function getRandomJamo(selectedJamoList, jamoList) {
  /* jamoList에 없는 임의의 자모를 찾아 리턴한다.
  selectedJamoList: 전역 변수인 초성, 중성, 종성 배열 중 선택된 배열
  jamoList: 사용자에게 제시할 자모 배열로, 노이즈 자모를 포함한다.
   */
  let min = 0;
  if (selectedJamoList === jongseong_list) {
    min = 1;
  }
  const max = selectedJamoList.length;
  while (true) {
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min; //최댓값은 제외, 최솟값은 포함
    const tmpJaso = selectedJamoList[randomIndex];
    if (!jamoList.includes(tmpJaso)) {
      // 사용자에게 제시할 배열에 없는 자소이면 추가한다.
      return tmpJaso;
    }
  }
}

function generateNoiseJamo(jamoList) {
  // 초성, 중성, 종성 배열마다 하나씩 노이즈 자모를 추가한다.
  [choseong_list, jungseong_list, jongseong_list].forEach(function(_list) {
    const noiseJamo = getRandomJamo(_list, jamoList);
    if (noiseJamo !== undefined) jamoList.push(noiseJamo);
  })
}

function separateJamo(char) {
  /* 분리할 한글 한 글자를 받아 초성, 중성, 종성으로 구분하여 배열로 리턴한다.
   */
  const hangul_start_codepoint = 44032;
  const char_codePoint = char.codePointAt();

  const codePoint = char_codePoint - hangul_start_codepoint;

  const choseong_index = parseInt(codePoint / 588);
  const jungseong_index = parseInt((codePoint - (choseong_index * 588)) / 28);
  const jongseong_index = parseInt(codePoint % 28);

  let jongseong;
  if (jongseong_index === 0) {
    jongseong = '';
  } else {
    jongseong = jongseong_list[jongseong_index];
  }

  return [
    choseong_list[choseong_index],
    jungseong_list[jungseong_index],
    jongseong
  ];
}

document.addEventListener("DOMContentLoaded", function () {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handleGetRequest;
  xhr.open('GET', 'http://localhost:8000/misschilds/');
  xhr.send();

  const retryBtn = document.createElement('input');
  // 실종아동 정보 다시 가져오기
  retryBtn.type = 'submit';
  retryBtn.classList.add('me-2');
  retryBtn.value = "↻";
  retryBtn.addEventListener('click', function () {
    xhr.open('GET', 'http://localhost:8000/misschilds/');
    xhr.send();
    handleGetRequest();
  });

  function handleGetRequest() {
    error_div.classList.add('d-none');

    captcha_div.innerHTML = '';
    // 서버에서 실종아동 정보를 가져온 후, 특정 글자를 자소분리하여 사용자가 클릭할 수 있는 UI를 제공한다.
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const response = xhr.responseText;
        const data = JSON.parse(response);
        const photo = document.createElement('img');
        photo.src = data.photo;
        photo.width = 100;
        photo.height = 100;
        captcha_div.appendChild(photo);

        const name_index = document.createElement('p');
        name_index.innerHTML = `이름에서 <span class="text-primary fw-bold">${data.i + 1}</span>번째 글자를 쓰는 순서대로 클릭하세요.`;

        // 실종아동 정보
        const description_box = document.createElement('div');
        description_box.classList.add('d-flex');
        description_box.classList.add('justify-content-center');
        const description = document.createElement('table');
        description.style.width = '300px';
        description.classList.add('table');
        description.classList.add('table-sm');

        const name = document.createElement('tr');
        let colored_jamo = '';  // 자소분리할 글자
        let name_value = '';  // 실종아동 이름
        for (let i = 0; i < data.name.length; i++) {
          const char = data.name[i]
          if (i === data.i) { // 자소분리할 글자 하이라이팅
            colored_jamo = char;
            name_value += `<span class="text-primary fs-4 fw-bold">${char}</span>`;
          } else {
            name_value += `${char}`;
          }
        }
        name.innerHTML = `<th>이름</th><td>${name_value}</td>`;

        const lost_age = document.createElement('tr');
        lost_age.innerHTML = `<th>실종시 나이</th><td>${data.lost_age}</td>`;
        const lost_location = document.createElement('tr');
        lost_location.innerHTML = `<th>실종장소</th><td>${data.lost_location}</td>`;
        const lost_date = document.createElement('tr');
        lost_date.innerHTML = `<th>실종날짜</th><td>${data.lost_date}</td>`;
        const looking = document.createElement('tr');
        looking.innerHTML = `<th>특징</th><td>${data.looking}</td>`;
        description.appendChild(name);
        description.appendChild(lost_location);
        description.appendChild(lost_age);
        description.appendChild(looking);
        description.appendChild(lost_date);
        description_box.appendChild(description);

        // 사용자가 클릭할 폼
        const jamo_div = document.createElement('div');
        const jamo_form = document.createElement('form');
        jamo_form.classList.add('mb-3');
        const jamo_list = separateJamo(colored_jamo);
        let result = ''; // 사용자가 클릭한 자소 순서를 저장

        // 사용자가 클릭한 자소를 보여준다.
        const resultBox = document.createElement('div');
        resultBox.classList.add('d-flex');
        resultBox.classList.add('justify-content-center');
        resultBox.classList.add('mb-3');
        const resultLabel = document.createElement('div');
        resultLabel.classList.add('border-bottom');
        resultLabel.classList.add('border-warning');
        resultLabel.style.width = '300px';
        resultLabel.setAttribute("role", "alert")
        resultLabel.innerHTML = '&nbsp;';
        resultBox.appendChild(resultLabel);

        generateNoiseJamo(jamo_list); // 노이즈 자모를 추가한다
        shuffle(jamo_list); // 사용자에게 제시할 자모를 섞는다.

        jamo_list.forEach(function(jamo) {
          if (jamo !== '') { // 종성이 없는 경우에는 버튼을 추가하지 않는다.
            const btnJamo = document.createElement('input');
            btnJamo.type = 'button';
            btnJamo.classList.add('border');
            btnJamo.classList.add('border-warning');
            btnJamo.classList.add('rounded-circle');
            btnJamo.classList.add('form-control-lg');
            btnJamo.classList.add('me-2');
            btnJamo.value = jamo;
            btnJamo.addEventListener('click', function () {
              result += `;${jamo}`;
              resultLabel.innerText += jamo;
            })
            jamo_form.appendChild(btnJamo);
          }
        })

        const csrftoken = getCookie('csrftoken');

        // 사용자가 클릭한 순서대로 서버에 인증을 요청한다.
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        submitBtn.value = "보내기";
        const xhr2 = new XMLHttpRequest();
        submitBtn.addEventListener('click', function () {
          xhr2.onreadystatechange = handleSubmit;
          xhr2.open('POST', `http://localhost:8000/misschilds/validate/${data.id}`, true);
          xhr2.setRequestHeader('X-CSRFToken', csrftoken);
          xhr2.setRequestHeader('Content-type', 'application/json');
          xhr2.send(JSON.stringify({'id': data.id, 'e': data.e, 'seq': result}));
          result = '';
          resultLabel.innerHTML = '&nbsp;';
        })

        function handleSubmit() {
          if (xhr2.readyState === XMLHttpRequest.DONE) {
            if (xhr2.status === 200) {
              window.location.href = '/signin'
            } else {
              captcha_div.classList.remove('d-none');
              error_div.classList.remove('d-none');
            }
          }
        }

        jamo_div.appendChild(jamo_form);
        jamo_div.appendChild(retryBtn);
        jamo_div.appendChild(submitBtn);
        captcha_div.appendChild(description_box);
        captcha_div.appendChild(name_index);
        captcha_div.appendChild(resultBox);
        captcha_div.appendChild(jamo_div);
      } else {
        console.log('fuck')
      }
    }
  }
})
