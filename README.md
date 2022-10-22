# hanCaptcha
## 소개
(re)captcha를 대체하기 위한 한글 입력 순서 기반 captcha

## 동기
- 몇 년 전 조카가 태어남
- 조카가 실종된다고 생각하니 끔찍
- captcha에서 신호등, 버스, 소화전 클릭하다가 화가 많이 남

## 미리보기
![preview](https://user-images.githubusercontent.com/48433348/196029430-f9d6bc30-e475-4279-a841-62d9e6880bdb.gif)

## 링크
- 소스코드: https://github.com/b1tk3y/hanCaptcha
- 문서: [hanCaptcha 만들기](https://sokuricat.com/browse/@b1tk3y/hancaptcha-%EB%A7%8C%EB%93%A4%EA%B8%B0-7ed9/%EC%86%8C%EA%B0%9C-f405)

## 구성
- Docker(compose)
- Django
- Postgresql

## 실행
- `cp sample.env .env`
- `.env` 파일 수정
- `make up` 또는 `docker-compose up -d`
- 자세한 건 [hanCaptcha 만들기](https://sokuricat.com/browse/@b1tk3y/hancaptcha-%EB%A7%8C%EB%93%A4%EA%B8%B0-7ed9/%EC%86%8C%EA%B0%9C-f405) 참고

## 테스트
- http://localhost:8000 접속
