
/* =========================
   요소 불러오기
========================= */

const screen = document.querySelector(".screen");
const background = document.querySelector(".cafe-background");

const title1 = document.querySelector(".scene-1 .title-image");
const subtitle1 = document.querySelector(".scene-1 .subtitle-image");

const title2 = document.querySelector(".scene-2 .title-image");
const subtitle2 = document.querySelector(".scene-2 .subtitle-image");

const scene2 = document.querySelector(".scene-2");

const scrollGuide = document.querySelector(".scroll-guide");
const clickGuide = document.querySelector(".click-guide");

const whyCafeTitle = document.querySelector(".why-cafe-title");

const circleLocation = document.querySelector(".circle-location");
const circleOpen = document.querySelector(".circle-open");
const circleFlexible = document.querySelector(".circle-flexible");


/* =========================
   기본 설정
========================= */

let currentStep = 0;
let isMoving = false;

const maxStep = 8;

const textDuration = 750;
const moveDuration = 1600;

// 클릭 진행 단계
// 0 = 클릭 전
// 1 = 제목 등장
// 2 = 첫 번째 원 등장
// 3 = 두 번째 원 등장
// 4 = 세 번째 원 등장

let clickStep = 0;


/* =========================
   텍스트 등장 / 퇴장 설정
========================= */

const elements = [
  { element: title1, start: 1, end: 3 },
  { element: subtitle1, start: 2, end: 3 },
  { element: scrollGuide, start: 3, end: 3 },
  { element: title2, start: 5, end: 8 },
  { element: subtitle2, start: 6, end: 8 },
  { element: clickGuide, start: 8, end: 8 }
];


/* =========================
   배경 및 왼쪽 글자 이동
========================= */

function moveBackground() {

  const backgroundWidth = background.offsetWidth;
  const screenWidth = window.innerWidth;

  const maxMove = Math.max(
    0,
    backgroundWidth - screenWidth
  );

  const isMoved = currentStep >= 7;

  const moveDistance = isMoved ? maxMove : 0;

  background.style.transform =
    `translateX(-${moveDistance}px)`;

  scene2.classList.toggle("move-left", isMoved);
}


/* =========================
   오른쪽 그래픽 초기화
========================= */

function resetClickScene() {

  clickStep = 0;

  whyCafeTitle.classList.remove("visible");

  circleLocation.classList.remove("visible");
  circleOpen.classList.remove("visible");
  circleFlexible.classList.remove("visible");
}


/* =========================
   스크롤 화면 업데이트
========================= */

function updateScene() {

  elements.forEach(({ element, start, end }) => {

    const shouldShow =
      currentStep >= start && currentStep <= end;

    element.classList.remove("visible", "exit");

    if (shouldShow) {

      element.classList.add("visible");

    } else if (currentStep > end) {

      element.classList.add("exit");

    }

  });

  moveBackground();

  screen.classList.toggle(
    "click-enabled",
    currentStep === 8
  );

  // STEP 8 이전으로 돌아가면 클릭 장면 초기화
  if (currentStep < 8) {
    resetClickScene();
  }
}


/* =========================
   마우스 스크롤
========================= */

window.addEventListener("wheel", (event) => {

  event.preventDefault();

  if (isMoving || Math.abs(event.deltaY) < 5) {
    return;
  }

  const direction = event.deltaY > 0 ? 1 : -1;
  const nextStep = currentStep + direction;

  if (nextStep < 0 || nextStep > maxStep) {
    return;
  }

  const previousStep = currentStep;

  currentStep = nextStep;
  isMoving = true;

  updateScene();

  const isBackgroundTransition =
    (previousStep === 6 && currentStep === 7) ||
    (previousStep === 7 && currentStep === 6);

  const duration = isBackgroundTransition
    ? moveDuration
    : textDuration;

  setTimeout(() => {
    isMoving = false;
  }, duration);

}, { passive: false });


/* =========================
   배경 클릭 인터랙션
========================= */

screen.addEventListener("click", () => {

  // STEP 8에서만 클릭 가능
  if (currentStep !== 8 || isMoving) {
    return;
  }

  // 클릭할 때마다 하나씩 등장
  if (clickStep === 0) {

    whyCafeTitle.classList.add("visible");
    clickStep = 1;

  } else if (clickStep === 1) {

    circleLocation.classList.add("visible");
    clickStep = 2;

  } else if (clickStep === 2) {

    circleOpen.classList.add("visible");
    clickStep = 3;

  } else if (clickStep === 3) {

    circleFlexible.classList.add("visible");
    clickStep = 4;

  }

});


/* =========================
   브라우저 크기 변경
========================= */

window.addEventListener("resize", () => {
  moveBackground();
});


/* =========================
   이미지 로딩 완료
========================= */

background.addEventListener("load", () => {
  moveBackground();
});


/* =========================
   최초 실행
========================= */

updateScene();
