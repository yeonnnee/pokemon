# Pokedex

포켓몬 OPEN API를 활용한 포켓몬 도감
<br />
[Pokedex 보러가기](https://pokedex-nv7x4zbgd-yeonnnee.vercel.app/?lang=ko)


#### 기간

2022-05-29 ~ 2022-06-23

<br/>

#### Stack
- Next.js
- [POKEMON API](https://pokeapi.co/)
- vercel

<br />

#### Preview

<Img src="https://user-images.githubusercontent.com/61894688/175268650-6b2d5788-0c87-4b64-9e15-48915cb7b298.PNG" width="600px" height="291px" alt="Main"/>

<Img src="https://user-images.githubusercontent.com/61894688/175268478-f0ad335c-9962-4e8a-b04c-8a49a8e1773a.PNG" width="600px" height="291px" alt="Detail"/>

<Img src="https://user-images.githubusercontent.com/61894688/175268025-b3e66bb9-4177-4625-8a9e-fa84e41d236f.PNG" width="600px" height="291px" alt="Stat"/>


<br/>



### 개발 내용

---


- 포켓몬 조회
    - 20개씩 조회
    - Intersection Observer Api를 활용하여 무한스크롤 구현
    - 타입에 따른 필터 기능 구현 (default는 풀타입 포켓몬)
    - 검색은 전체 검색으로 영문으로만 검색 가능
    - 포켓몬 색상에 맞게 label color 지정
    - 도감 번호, 포켓몬 이름, 포켓몬 일러스트 노출
    - 거다이맥스의 경우 도감번호대신 거다이맥스 표기
    - 해당 포켓몬 클릭시 상세페이지 이동

- 다국어 지원
    - 한국어(default)
    - 영어
    - 일본어

- 상세페이지
    - 도감 설명: 시리즈마다 설명이 다르므로 선택된 시리즈에 맞는 설명 보여주기
    - 기본정보
        - 사진
        - 도감번호 (전국도감 기준)
        - 이름
        - 타입
  
    - 세부정보
        - 분류
        - 신장
        - 체중
        - 포획률
      
    - 특성: 숨겨진 특성은 * 표시와 함께 hover시 tooltip 노출
    - 진화 : 이미지 hover시 tooltip으로 포켓몬 이름 노출 및 이미지 클릭시 해당 포켓몬 상세페이지로 이동
    - 종족치: Chart.js 라이브러리를 활용해 종족치 표시 및 total 표기


