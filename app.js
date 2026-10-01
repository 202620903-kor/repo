/* ==========================================================
   사회생활 START - app.js
   localStorage 기반 상태관리 / 화면 전환 / 점수 계산
   ========================================================== */
"use strict";

/* ---------------- 데이터 ---------------- */

const JOB_CATEGORIES = [
  {
    name: "사무·행정",
    jobs: [
      { id: "office", emoji: "🧑‍💼", name: "일반 사무원", desc: "문서 작성, 자료 입력, 일정 관리 등 회사의 사무를 담당해요." },
      { id: "accounting", emoji: "🧾", name: "회계 사무원", desc: "영수증과 거래 내역을 정리하고 회계 업무를 보조해요." },
      { id: "reception", emoji: "🛎️", name: "안내·접수 직원", desc: "방문객을 안내하고 문의와 예약을 접수해요." },
      { id: "callcenter", emoji: "🎧", name: "고객 상담원", desc: "전화나 온라인으로 고객의 질문과 요청을 도와요." },
    ],
  },
  {
    name: "서비스·음식",
    jobs: [
      { id: "service", emoji: "☕", name: "카페 바리스타", desc: "커피와 음료를 만들고 손님을 응대해요." },
      { id: "cook", emoji: "🍳", name: "조리·주방 직원", desc: "재료를 손질하고 음식을 조리해요." },
      { id: "hotel", emoji: "🏨", name: "호텔 프런트 직원", desc: "체크인·체크아웃을 돕고 투숙객의 요청을 처리해요." },
      { id: "eventstaff", emoji: "🎟️", name: "행사 운영 스태프", desc: "공연과 행사장에서 관객 안내와 현장 운영을 맡아요." },
    ],
  },
  {
    name: "기술·생산",
    jobs: [
      { id: "tech", emoji: "🔧", name: "전기·설비 기술 보조", desc: "건물의 전기와 설비를 점검하고 수리 작업을 도와요." },
      { id: "auto", emoji: "🚗", name: "자동차 정비원", desc: "자동차의 상태를 확인하고 부품을 점검·정비해요." },
      { id: "production", emoji: "🏭", name: "생산·품질 검사원", desc: "제품을 만들고 완성품에 이상이 없는지 확인해요." },
      { id: "itrepair", emoji: "🖥️", name: "컴퓨터 수리 기사", desc: "컴퓨터와 주변 기기의 고장을 확인하고 수리해요." },
    ],
  },
  {
    name: "판매·유통",
    jobs: [
      { id: "sales", emoji: "🛍️", name: "매장 판매원", desc: "상품을 소개하고 고객의 구매를 도와요." },
      { id: "convenience", emoji: "🏪", name: "편의점 직원", desc: "상품 진열, 계산, 매장 정리와 고객 응대를 해요." },
      { id: "logistics", emoji: "📦", name: "물류센터 직원", desc: "상품을 분류하고 포장해 배송 준비를 해요." },
      { id: "onlineorder", emoji: "🛒", name: "온라인 쇼핑몰 운영 보조", desc: "주문과 상품 정보를 관리하고 배송을 확인해요." },
    ],
  },
  {
    name: "콘텐츠·IT",
    jobs: [
      { id: "webdesign", emoji: "🎨", name: "웹·그래픽 디자이너", desc: "웹사이트와 홍보물에 쓰이는 시각 자료를 만들어요." },
      { id: "videoedit", emoji: "🎬", name: "영상 편집자", desc: "영상과 음향을 편집해 보기 좋은 콘텐츠를 만들어요." },
      { id: "ithelpdesk", emoji: "💻", name: "IT 지원 직원", desc: "컴퓨터와 프로그램 사용 문제를 안내하고 해결해요." },
      { id: "photostudio", emoji: "📷", name: "사진 스튜디오 보조", desc: "촬영 준비와 장비 정리, 사진 파일 관리를 도와요." },
    ],
  },
];

const JOBS = JOB_CATEGORIES.flatMap((category) => category.jobs);

const SALARIES = [
  { id: "s180", amount: 1800000, label: "기본 월급", desc: "첫 직장의 평범한 월급이에요." },
  { id: "s220", amount: 2200000, label: "보통 월급", desc: "자격증이 하나 있으면 받을 수 있어요." },
  { id: "s260", amount: 2600000, label: "좋은 월급", desc: "대회 수상 등 스펙이 있을 때 받아요." },
  { id: "s300", amount: 3000000, label: "높은 월급", desc: "현장 실습에서 눈에 띈 인재예요!" },
  { id: "s340", amount: 3400000, label: "여유 월급", desc: "경험과 실력을 쌓아 더 높은 월급을 받아요." },
  { id: "s380", amount: 3800000, label: "경력 월급", desc: "업무 경험을 인정받아 월급이 올랐어요." },
  { id: "s420", amount: 4200000, label: "전문 월급", desc: "전문성을 살려 높은 월급을 받아요." },
  { id: "s460", amount: 4600000, label: "고소득 월급", desc: "풍부한 경험과 실력을 갖춘 직장인이에요." },
  { id: "s500", amount: 5000000, label: "최고 월급", desc: "월 500만 원을 받는 설정이에요." },
];

const HOUSINGS = [
  { id: "alone",   emoji: "🏠", name: "자취",          desc: "혼자 살아요. 자유롭지만 월세·관리비가 나가요.", fixed: 500000, asset: 2000000 },
  { id: "dorm",    emoji: "🏨", name: "기숙사",        desc: "회사 기숙사에서 지내요. 비용이 저렴해요.",       fixed: 300000, asset: 1000000 },
  { id: "parents", emoji: "🏡", name: "부모님과 거주", desc: "부모님과 함께 살아요. 생활비만 조금 내요.",     fixed: 100000, asset: 3000000 },
];

const CATEGORIES = [
  { id: "food",      emoji: "🍚", name: "식비",   desc: "밥, 카페, 배달음식 등 먹는 데 쓰는 돈", presets: [[25000, "알뜰하게"], [62500, "보통으로"], [112500, "외식 많이"]] },
  { id: "transport", emoji: "🚇", name: "교통비", desc: "버스, 지하철, 택시 등 이동 비용",        presets: [[12500, "자전거 타기"], [25000, "대중교통"], [50000, "택시 자주"]] },
  { id: "phone",     emoji: "📱", name: "통신비", desc: "휴대폰 요금과 인터넷 비용",              presets: [[7500, "알뜰 요금제"], [15000, "보통 요금제"], [25000, "무제한 요금제"]] },
  { id: "leisure",   emoji: "🎮", name: "여가비", desc: "영화, 게임, 쇼핑, 여행 등 즐거운 지출",   presets: [[12500, "절약 모드"], [37500, "적당한 여가"], [87500, "신나게 놀기"]] },
];

const STOCKS = [
  { id: "bank",    emoji: "🏦", name: "안전은행",   base: 50000,  vol: 0.04, desc: "등락이 적은 가장 안전한 은행 주식" },
  { id: "chicken", emoji: "🍗", name: "치킨프렌즈", base: 20000,  vol: 0.10, desc: "호불호가 큰 국민 치킨 프랜차이즈" },
  { id: "rocket",  emoji: "📱", name: "로켓전자",   base: 80000,  vol: 0.12, desc: "기술력이 좋은 대형 전자회사" },
  { id: "green",   emoji: "⚡", name: "그린에너지", base: 35000,  vol: 0.16, desc: "빠르게 성장 중인 신재생에너지 기업" },
  { id: "space",   emoji: "🚀", name: "우주여행",   base: 150000, vol: 0.25, desc: "오르락내리락이 극심! 초고위험 고수익" },
];

const SCENARIOS = [
  {
    id: "wake", emoji: "⏰", title: "아침 출근 위기",
    desc: "알람을 듣지 못했어요! 눈을 떠보니 출근 시간 20분 전. 어떻게 할까요?",
    choices: [
      { label: "전력질주해서 뛰어간다", points: 10, money: 0, tone: "good",
        result: "버스를 놓칠 뻔했지만 뛰어서 아슬아슬하게 정시 출근 성공! 땀에 젖었지만 뿌듯한 하루의 시작이에요." },
      { label: "택시를 타고 간다", points: 6, money: -15000, moneyLabel: "출근 택시비", tone: "soso",
        result: "택시 덕분에 정시 도착! 돈이 1만 5천 원 나갔지만 지각은 면했어요." },
      { label: "늦잠을 자고 지각한다", points: -8, money: 0, tone: "bad",
        result: "15분 지각. 팀장님이 한 번은 봐주셨지만 찝찝한 하루의 시작이 되었어요." },
    ],
  },
  {
    id: "report", emoji: "📄", title: "업무 실수 발생",
    desc: "어제 만든 보고서의 숫자를 잘못 입력한 사실을 방금 발견했어요. 이미 팀장님께 제출한 상태인데... 어떻게 할까요?",
    choices: [
      { label: "당장 팀장님께 알리고 수정한다", points: 15, money: 0, tone: "good",
        result: "\"빨리 알려줘서 고맙다!\" 팀장님이 오히려 성실한 태도를 칭찬했어요. 실수는 빠르게 인정하는 게 최고!" },
      { label: "몰래 고치려고 시도한다", points: -15, money: 0, tone: "bad",
        result: "수정하다가 더 틀려서 들통났어요. 실수보다 숨긴 것이 더 큰 문제가 되었어요." },
      { label: "동료에게 떠넘긴다", points: -20, money: 0, tone: "bad",
        result: "결국 진실이 밝혀지고 동료는 물론 팀장님의 신뢰도 잃었어요." },
    ],
  },
  {
    id: "conflict", emoji: "🤝", title: "동료와의 갈등",
    desc: "같이 맡은 업무를 동료가 자기 혼자 다 끝냈다며 \"너는 뭐 했어?\"라고 화를 냈어요. 어떻게 할까요?",
    choices: [
      { label: "차분하게 상황을 설명하고 대화로 푼다", points: 12, money: 0, tone: "good",
        result: "서로 소통이 부족했다는 걸 알게 되었고, 앞으로 업무를 나누는 방식을 정했어요. 관계가 더 좋아졌어요!" },
      { label: "소리를 지르며 맞선다", points: -15, money: 0, tone: "bad",
        result: "사무실 안이 조용해졌어요... 누가 옳았든 다른 동료들에게 보여줄 모습은 아니었어요." },
      { label: "아무 말 없이 혼자 참고 넘어간다", points: 2, money: 0, tone: "soso",
        result: "싸움은 피했지만 속상한 마음이 남았어요. 가끔은 솔직하게 이야기하는 것도 필요해요." },
    ],
  },
  {
    id: "overtime", emoji: "🌙", title: "퇴근 직전, 야근 요청",
    desc: "퇴근 10분 전, 팀장님이 \"내일 행사 준비가 급한데 도와줄 수 있을까?\"라고 하셨어요. 어떻게 할까요?",
    choices: [
      { label: "수락하고 열심히 돕는다", points: 10, money: 80000, moneyLabel: "야근수당", tone: "good",
        result: "팀장님께 큰 신뢰를 얻었어요! 야근수당도 받고, 팀 분위기도 좋아졌어요." },
      { label: "사정을 정중히 말하고 거절한다", points: 2, money: 0, tone: "soso",
        result: "\"오늘은 병원 예약이 있어서 죄송합니다.\" 정중하게 거절하니 팀장님도 이해해주셨어요." },
      { label: "듣지 못한 척 그냥 퇴근한다", points: -12, money: 0, tone: "bad",
        result: "팀장님의 표정이 굳었어요. 어쩔 수 없는 상황이라도 말이라도 했어야 했는데..." },
    ],
  },
  {
    id: "dinner", emoji: "🍻", title: "팀 회식 초대",
    desc: "오늘 팀 회식이 있어요. 가고 싶지 않은 마음도 조금 있지만... 어떻게 할까요?",
    choices: [
      { label: "끝까지 참석해서 동료들과 친해진다", points: 8, money: -70000, moneyLabel: "회식비", tone: "good",
        result: "평소 담백했던 선배와 이야기하면서 많은 것을 배웠어요. 회식비 7만 원이 나갔지만 나쁘지 않은 선택!" },
      { label: "1시간만 참석하고 인사 후 일찍 귀가한다", points: 5, money: -30000, moneyLabel: "회식비", tone: "soso",
        result: "얼굴도 보고 마음도 표현했어요. 무리하지 않는 선에서 참석하는 것도 방법이에요." },
      { label: "가지 않는다", points: -5, money: 0, tone: "bad",
        result: "돈은 아꼈지만 다음 날 회식 이야기가 끊이지 않았어요. 가끔은 팀과 어울리는 시간도 필요해요." },
    ],
  },
  {
    id: "praise", emoji: "🌟", title: "상사의 칭찬",
    desc: "이번 달 업무를 잘했다며 팀장님이 공개적으로 칭찬해주셨어요! 어떻게 반응할까요?",
    choices: [
      { label: "겸손하게 감사 인사를 전한다", points: 10, money: 0, tone: "good",
        result: "\"다들 도와주셔서 가능했어요, 감사합니다!\" 주변 동료들도 기분 좋게 웃었어요." },
      { label: "자신감 있게 내 성과를 강조한다", points: 3, money: 0, tone: "soso",
        result: "사실을 말한 것뿐이지만 조금 과한 느낌이 들었는지 분위기가 살짝 어색해졌어요." },
      { label: "아무렇지 않게 무시하고 넘어간다", points: -5, money: 0, tone: "bad",
        result: "칭찬에 반응이 없자 팀장님이 조금 서운해하신 것 같아요. 기쁨을 표현하는 것도 기술이에요." },
    ],
  },
];

const JOB_SCENARIOS = {
  office: {
    task: "거래처에 보낼 회의 자료를 정리하고 발송",
    teamwork: "회의 자료의 내용과 참석자 일정을 동료와 조율",
    urgent: "오늘 안에 회의 자료를 정리해 참석자에게 전달",
    title: "잘못 전달된 인사 자료",
    desc: "일반 사무 업무 중 직원 연락처와 급여 정보가 포함된 파일을 외부 거래처에 잘못 보낸 걸 발견했어요. 어떻게 할까요?",
    good: "팀장에게 즉시 알리고 메일 회수와 자료 삭제를 요청한다",
    soso: "거래처에 먼저 연락해 파일을 삭제해달라고 부탁한다",
    bad: "아무도 모를 것 같아 보고하지 않고 넘어간다",
  },
  accounting: {
    task: "월말 거래 내역과 증빙 서류를 확인해 장부 마감",
    teamwork: "증빙 서류를 확인하고 비용 내역을 마감",
    urgent: "신고 마감 전에 누락된 증빙을 검토",
    title: "마감 직전 발견한 장부 차이",
    desc: "회계 마감 직전, 영수증 합계와 장부 금액이 맞지 않는 것을 발견했어요. 원인을 아직 찾지 못했는데 어떻게 할까요?",
    good: "차이가 난 내역을 표시하고 담당자에게 바로 공유한다",
    soso: "마감부터 맞추려고 장부 금액을 임의로 수정한다",
    bad: "작은 차이라 생각하고 그대로 제출한다",
  },
  reception: {
    task: "방문객 예약 시간을 확인하고 담당자에게 안내",
    teamwork: "방문 일정과 담당자 연결을 동료와 조율",
    urgent: "곧 도착할 단체 방문객의 안내 준비",
    title: "방문객의 개인정보 요청",
    desc: "안내·접수 중 방문객이 자리에 없는 직원의 개인 연락처를 알려달라고 해요. 급한 일이라며 재촉하는데 어떻게 할까요?",
    good: "연락처는 안내할 수 없다고 설명하고 담당 부서에 연결한다",
    soso: "방문객의 말을 믿고 연락처를 알려준다",
    bad: "요청을 무시하고 방문객을 그냥 돌려보낸다",
  },
  callcenter: {
    task: "고객 문의와 환불 요청에 정확히 답변",
    teamwork: "복잡한 문의 내용을 다음 상담 직원에게 인계",
    urgent: "상담 대기 고객이 몰려 문의를 빠르게 정리",
    title: "규정 밖의 보상 요구",
    desc: "고객 상담 중 한 고객이 회사 규정에 없는 큰 보상을 요구하며 화를 내고 있어요. 어떻게 응대할까요?",
    good: "불편을 공감하고 가능한 해결 방법을 확인해 안내한다",
    soso: "상황을 빨리 끝내려고 승인 없이 보상을 약속한다",
    bad: "고객의 말을 끊고 상담을 일방적으로 종료한다",
  },
  service: {
    task: "매장 오픈 전 음료 재료와 좌석을 준비",
    teamwork: "주문을 받고 음료 제조 순서를 동료와 조율",
    urgent: "손님이 몰리기 전에 매장 준비를 마무리",
    title: "음료 주문의 알레르기 확인",
    desc: "카페에서 음료를 만들려는데 손님이 특정 재료 알레르기가 있다고 말해요. 이미 음료 제조를 시작했는데 어떻게 할까요?",
    good: "제조를 멈추고 재료와 도구를 확인한 뒤 안전한 방법을 안내한다",
    soso: "재료를 빼기만 하면 괜찮을 거라 생각하고 계속 만든다",
    bad: "바쁜 시간이라 알레르기 이야기를 대수롭지 않게 넘긴다",
  },
  cook: {
    task: "점심시간 전에 재료를 손질하고 주문 음식을 준비",
    teamwork: "밀려드는 주문의 조리 순서와 역할을 동료와 나누기",
    urgent: "퇴근 직전 갑자기 들어온 단체 주문 준비",
    title: "조리 중 발견한 식재료 이상",
    desc: "주방에서 조리할 재료의 냄새와 상태가 평소와 다른 것을 발견했어요. 주문이 밀려 있어도 어떻게 해야 할까요?",
    good: "해당 재료 사용을 멈추고 책임자에게 알려 상태를 확인한다",
    soso: "이상한 부분만 제거하고 나머지는 조리에 사용한다",
    bad: "주문이 밀렸으니 일단 사용하고 아무 말도 하지 않는다",
  },
  hotel: {
    task: "체크인 예약을 확인하고 객실 준비 상태를 점검",
    teamwork: "객실 준비와 손님 요청을 다른 직원과 나눠 처리",
    urgent: "체크인 손님이 몰리기 전 객실 상태를 확인",
    title: "예약 객실이 준비되지 않았어요",
    desc: "호텔 체크인 시간인데 예약된 객실 청소가 끝나지 않았고 손님이 도착했어요. 어떻게 안내할까요?",
    good: "상황을 정중히 설명하고 가능한 대기 시간과 대안을 확인한다",
    soso: "객실이 곧 준비된다고 확인 없이 확답한다",
    bad: "다른 직원에게 미루고 손님에게 아무 안내도 하지 않는다",
  },
  eventstaff: {
    task: "공연장 입장 동선을 확인하고 관객을 안내",
    teamwork: "관객 입장 순서와 안내 위치를 동료와 조율",
    urgent: "공연 시작 전 입장 지연 상황을 정리",
    title: "공연장 통로를 막은 대기 줄",
    desc: "행사 입장 대기 줄이 길어져 비상 통로까지 막고 있어요. 관객들은 빨리 들여보내 달라고 재촉합니다. 어떻게 할까요?",
    good: "안전을 먼저 확보하고 책임자와 함께 줄을 재배치한다",
    soso: "입장을 서두르기 위해 통로가 막힌 채로 진행한다",
    bad: "문제가 생길 때까지 모른 척하고 맡은 자리만 지킨다",
  },
  tech: {
    task: "건물 전기 설비를 점검하고 이상 여부를 기록",
    teamwork: "설비 점검 구역과 작업 순서를 동료와 조율",
    urgent: "업무 종료 전 고장 난 설비의 안전 조치와 보고",
    title: "반복해서 내려가는 차단기",
    desc: "설비 점검 중 차단기가 반복해서 내려가는 것을 발견했어요. 주변에서는 전원을 다시 올려달라고 재촉합니다. 어떻게 할까요?",
    good: "위험 구역을 알리고 전원을 차단한 뒤 담당자와 원인을 확인한다",
    soso: "원인을 확인하지 않은 채 차단기를 다시 올린다",
    bad: "고장 징후를 기록하지 않고 다음 근무자에게 넘긴다",
  },
  auto: {
    task: "입고 차량의 브레이크 부품을 점검하고 정비",
    teamwork: "정비할 차량의 점검 항목과 부품을 선임과 확인",
    urgent: "고객이 찾으러 오기 전 차량 점검을 마무리",
    title: "확신이 서지 않는 브레이크 점검",
    desc: "자동차 정비 중 브레이크 부품의 상태가 애매해요. 고객은 오늘 차를 꼭 찾아가야 한다고 재촉합니다. 어떻게 할까요?",
    good: "차량을 출고하지 않고 선임과 함께 부품 상태를 다시 확인한다",
    soso: "눈에 띄는 문제가 없으니 점검을 마무리하고 출고한다",
    bad: "고객이 급하다고 하니 확인 없이 괜찮다고 말한다",
  },
  production: {
    task: "출고 예정 제품을 검사하고 품질 기록을 작성",
    teamwork: "생산 수량과 검사 결과를 동료와 맞춰 확인",
    urgent: "출고 마감 전 검사 대기 제품을 점검",
    title: "출고 직전 발견한 제품 불량",
    desc: "생산·품질 검사 중 출고 예정 제품에서 같은 결함이 반복되는 걸 발견했어요. 출고 마감이 얼마 남지 않았는데 어떻게 할까요?",
    good: "해당 제품을 분리하고 결함 수량과 내용을 즉시 보고한다",
    soso: "불량 제품 몇 개만 빼고 나머지는 확인 없이 출고한다",
    bad: "마감에 맞추려고 검사 결과를 정상으로 기록한다",
  },
  itrepair: {
    task: "고객 컴퓨터의 저장 장치와 오류 원인을 점검",
    teamwork: "고장 증상과 점검 결과를 동료 기사와 공유",
    urgent: "고객이 방문하기 전 컴퓨터 점검 결과를 정리",
    title: "수리 전 데이터 백업 문제",
    desc: "컴퓨터 수리 중 저장 장치에 이상 징후가 보여요. 바로 수리하면 고객 파일이 사라질 수도 있는데 어떻게 할까요?",
    good: "작업을 멈추고 고객에게 데이터 위험을 설명한 뒤 백업 방법을 상의한다",
    soso: "고객 동의 없이 복구 프로그램을 먼저 실행한다",
    bad: "파일 손실 가능성을 알리지 않고 수리를 진행한다",
  },
  sales: {
    task: "고객에게 상품 기능과 교환 조건을 안내",
    teamwork: "고객 요청 상품의 재고와 진열 상태를 동료와 확인",
    urgent: "매장 마감 전 고객 주문과 상품 안내를 마무리",
    title: "확실하지 않은 상품 기능 문의",
    desc: "매장 고객이 상품의 기능과 환불 조건을 자세히 물어보는데 정확한 답을 모르겠어요. 어떻게 할까요?",
    good: "모르는 부분은 확인이 필요하다고 말하고 안내 자료나 동료에게 확인한다",
    soso: "판매를 위해 기능이 될 것 같다고 추측해서 답한다",
    bad: "질문을 피하고 다른 상품만 계속 권한다",
  },
  convenience: {
    task: "매대 상품을 채우고 계산대 마감 정산",
    teamwork: "교대 전 재고와 전달 사항을 다음 근무자와 확인",
    urgent: "교대 시간 전 입고 상품 정리와 계산대 마감",
    title: "마감 정산 금액이 맞지 않아요",
    desc: "편의점 마감 중 계산대 현금과 정산 금액이 맞지 않는 걸 발견했어요. 다음 근무자가 곧 오는데 어떻게 할까요?",
    good: "정산 내역을 다시 확인하고 점장에게 차이를 보고한다",
    soso: "다음 근무자가 오기 전에 개인 돈으로 차액을 채운다",
    bad: "정산을 맞게 보이도록 기록을 바꾼다",
  },
  logistics: {
    task: "배송 상품을 분류하고 출고 수량을 확인",
    teamwork: "출고 상품의 분류와 배송 순서를 동료와 조율",
    urgent: "배송 차량 출발 전 남은 상품을 분류하고 출고",
    title: "배송 전 발견한 파손 상자",
    desc: "물류센터에서 출고할 상자가 찌그러져 안의 상품도 손상됐을 수 있어요. 배송 차량이 곧 출발하는데 어떻게 할까요?",
    good: "상자를 출고 구역에서 분리하고 파손 상태를 담당자에게 알린다",
    soso: "겉상자만 다시 포장해 바로 배송한다",
    bad: "출고 수량을 맞추기 위해 파손 사실을 숨긴다",
  },
  onlineorder: {
    task: "온라인 주문을 확인하고 판매 상품의 재고를 관리",
    teamwork: "상품 재고와 고객 주문 변경 내용을 동료와 공유",
    urgent: "주문 마감 전 품절 상품과 배송 일정을 확인",
    title: "주문 수량과 재고가 달라요",
    desc: "온라인 주문이 몰린 상품의 실제 재고가 주문 시스템 수량보다 적어요. 고객에게 품절 안내가 나가기 전인데 어떻게 할까요?",
    good: "재고를 다시 확인하고 판매 상태를 조정한 뒤 고객 대응을 공유한다",
    soso: "재고가 들어올 거라 기대하며 주문을 그대로 확정한다",
    bad: "재고 수량을 실제보다 많게 입력해 주문을 계속 받는다",
  },
  webdesign: {
    task: "웹페이지 시안을 수정하고 화면별 표시를 확인",
    teamwork: "웹페이지 문구와 디자인 수정 범위를 담당자와 조율",
    urgent: "오늘 공개할 웹페이지의 최종 수정을 마무리",
    title: "마감 직전 바뀐 웹페이지 요청",
    desc: "웹페이지 공개 직전, 담당자가 처음 합의한 내용과 다른 큰 디자인 수정을 요청했어요. 마감은 오늘입니다. 어떻게 할까요?",
    good: "변경 범위와 일정 영향을 정리해 담당자와 우선순위를 합의한다",
    soso: "영향을 알리지 않고 혼자 밤새워 수정하겠다고 한다",
    bad: "요청을 확인하지 않고 기존 시안 그대로 공개한다",
  },
  videoedit: {
    task: "촬영 영상을 편집하고 화면과 음향을 맞춰 납품",
    teamwork: "영상 장면 순서와 수정 의견을 담당자와 검토",
    urgent: "납품 시간 전 영상 자막과 음향 수정을 마무리",
    title: "최종 영상에 들어간 음원 문제",
    desc: "영상 편집을 마친 뒤 사용한 음원의 이용 허가가 확인되지 않았다는 걸 알게 됐어요. 납품 시간은 얼마 남지 않았습니다. 어떻게 할까요?",
    good: "담당자에게 알리고 사용 가능한 음원으로 교체할지 빠르게 협의한다",
    soso: "문제가 없기를 바라며 현재 음원 그대로 납품한다",
    bad: "음원 출처를 확인하지 않은 채 확인 완료로 표시한다",
  },
  ithelpdesk: {
    task: "직원의 계정과 컴퓨터 사용 문제를 확인해 지원",
    teamwork: "반복되는 컴퓨터 문제와 해결 방법을 동료와 공유",
    urgent: "업무 시작 전 여러 직원의 로그인 문제를 해결",
    title: "본인 확인이 되지 않은 비밀번호 초기화",
    desc: "IT 지원 요청자가 급하다며 다른 직원의 계정 비밀번호를 대신 초기화해달라고 해요. 요청자의 신원을 확인할 수 없는 상황입니다. 어떻게 할까요?",
    good: "정해진 본인 확인 절차를 안내하고 확인 전에는 초기화하지 않는다",
    soso: "급한 업무라고 하니 우선 임시 비밀번호를 발급한다",
    bad: "요청자를 확인하지 않고 계정 정보를 전달한다",
  },
  photostudio: {
    task: "촬영 장비를 준비하고 고객 사진 파일을 정리",
    teamwork: "촬영 순서와 고객 요청 사항을 사진사와 확인",
    urgent: "고객 방문 전 촬영 파일과 결과물을 준비",
    title: "고객 촬영 파일을 찾을 수 없어요",
    desc: "사진 스튜디오에서 고객이 예약한 촬영 파일이 예상 위치에 보이지 않아요. 고객이 곧 결과물을 받으러 오는데 어떻게 할까요?",
    good: "저장 장치를 확인하고 담당자에게 즉시 알려 복구 여부를 확인한다",
    soso: "파일을 찾지 못했지만 곧 찾을 수 있다고 고객에게 확답한다",
    bad: "파일 문제를 숨기고 고객을 기다리게만 한다",
  },
};

/* ---------------- 상태 관리 ---------------- */

const STORAGE_KEY = "socialLifeSimV1";

function defaultState() {
  return {
    view: "home",
    started: false,
    setup: { name: "", jobId: "", salaryId: "", housingId: "", housingCost: 0 },
    balance: 0,   // 이번 주 쓸 수 있는 돈
    monthBalance: 0, // 이번 달 전체 남은 돈 (아직 지급되지 않은 주간 생활비 포함)
    weeklyBudget: 0, // 매주 지급할 생활비
    weeklyReserve: 0, // 다음 주 이후 지급할 생활비
    savings: 0,   // 저축액
    asset: 0,     // 초기 자산
    spent: { food: 0, transport: 0, phone: 0, leisure: 0 },
    weekSpent: { food: 0, transport: 0, phone: 0, leisure: 0 },
    log: [],      // { type, catId, label, amount }
    stocks: {
      week: 1, closed: false, source: "asset",
      holdings: {},          // { stockId: { qty, avg } }
      prices: {},            // { stockId: [주가 히스토리] }
      investedTotal: 0,      // 누적 매수 금액
      returnedTotal: 0,      // 누적 매도 금액
      news: "",
    },
    workScore: 50,
    answers: {},  // { scenarioId: choiceIndex }
  };
}

let state = defaultState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    const d = defaultState();
    Object.assign(d, saved);
    d.setup = Object.assign(defaultState().setup, saved.setup || {});
    {
      const rawCost = Number(d.setup.housingCost);
      if (Number.isFinite(rawCost)) d.setup.housingCost = clamp(Math.round(rawCost), 0, 1000000);
      else {
        const h0 = HOUSINGS.find((x) => x.id === d.setup.housingId);
        d.setup.housingCost = h0 ? h0.fixed : 0;
      }
    }
    d.spent = Object.assign(defaultState().spent, saved.spent || {});
    d.weekSpent = Object.assign(defaultState().weekSpent, saved.weekSpent || {});
    d.answers = Object.assign({}, saved.answers || {});
    d.stocks = Object.assign(defaultState().stocks, saved.stocks || {});
    d.stocks.holdings = Object.assign({}, (saved.stocks || {}).holdings || {});
    d.stocks.prices = Object.assign({}, (saved.stocks || {}).prices || {});
    STOCKS.forEach((s) => {
      if (!Array.isArray(d.stocks.prices[s.id]) || !d.stocks.prices[s.id].length) {
        d.stocks.prices[s.id] = [s.base];
      }
    });
    d.stocks.week = clamp(Number(d.stocks.week) || 1, 1, 4);
    if (Number.isFinite(Number(saved.monthBalance))
      && saved.weeklyBudget !== undefined && saved.weeklyReserve !== undefined) {
      d.monthBalance = Number(saved.monthBalance);
      d.weeklyBudget = Math.max(0, Number(d.weeklyBudget) || 0);
      d.weeklyReserve = Math.max(0, Number(d.weeklyReserve) || 0);
    } else {
      // 기존 저장 데이터는 월 잔액을 현재 주와 다음 주 예산으로 나눠 이어갑니다.
      d.monthBalance = Number(d.balance) || 0;
      const weeksLeft = 5 - d.stocks.week;
      d.weeklyBudget = Math.max(0, Math.floor(d.monthBalance / weeksLeft));
      d.balance = Math.min(d.monthBalance, d.weeklyBudget);
      d.weeklyReserve = Math.max(0, d.monthBalance - d.balance);
    }
    if (!["home", "setup", "money", "work", "result"].includes(d.view)) d.view = "home";
    if (!d.started && ["money", "work", "result"].includes(d.view)) d.view = "home";
    state = d;
  } catch (e) {
    state = defaultState();
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* 저장 실패 무시 */ }
}

/* ---------------- 유틸 ---------------- */

const $ = (sel) => document.querySelector(sel);

function fmtW(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }
function man(n) { return (n / 10000).toLocaleString("ko-KR") + "만원"; }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function getJob()     { return JOBS.find((j) => j.id === state.setup.jobId) || null; }
function getSalary()  { return SALARIES.find((s) => s.id === state.setup.salaryId) || null; }
function getHousing() { return HOUSINGS.find((h) => h.id === state.setup.housingId) || null; }
function getHousingCost() {
  const c = Number(state.setup.housingCost);
  if (Number.isFinite(c) && c >= 0) return c;
  const h = getHousing();
  return h ? h.fixed : 0;
}
function getCat(id)   { return CATEGORIES.find((c) => c.id === id) || null; }

function getWorkScenarios() {
  const job = getJob();
  const challenge = job && JOB_SCENARIOS[job.id];
  if (!challenge) return SCENARIOS;

  const roleScenarios = SCENARIOS.map((sc) => {
    let id = sc.id;
    let title = sc.title;
    let desc = sc.desc;
    let choices = sc.choices;
    if (sc.id === "wake") {
      title = `출근 위기 · ${job.name}`;
      desc = `오늘 맡은 업무는 "${challenge.task}"예요. 출근길에 예기치 못한 일이 생겨 근무 시작에 늦을 것 같은데, 어떻게 할까요?`;
    } else if (sc.id === "report") {
      id = `job-${job.id}`;
      title = challenge.title;
      desc = challenge.desc;
      choices = [
        { label: challenge.good, points: 15, money: 0, tone: "good",
          result: "문제를 바로 공유하고 필요한 절차를 따라 피해를 막았어요. 책임감 있는 태도가 신뢰를 얻었어요." },
        { label: challenge.soso, points: 3, money: 0, tone: "soso",
          result: "급한 마음에 충분히 확인하지 못했어요. 중요한 업무일수록 동료와 확인하면 더 안전해요." },
        { label: challenge.bad, points: -15, money: 0, tone: "bad",
          result: "문제를 제때 알리지 않아 상황이 더 커질 수 있어요. 정확한 보고와 확인이 중요해요." },
      ];
    } else if (sc.id === "conflict") {
      title = `${job.name} 동료와 업무 조율`;
      desc = `동료와 "${challenge.teamwork}" 업무를 함께하던 중 역할 분담에 대한 오해로 동료가 "너는 뭐 했어?"라며 화를 냈어요. 어떻게 할까요?`;
    } else if (sc.id === "overtime") {
      title = `${job.name} 마감 직전 추가 업무`;
      desc = `퇴근 10분 전, 팀장님이 "${challenge.urgent}" 업무를 도와달라고 부탁했어요. 어떻게 할까요?`;
    } else if (sc.id === "dinner") {
      title = `${job.name} 동료와의 팀 회식`;
      desc = `오늘 동료들과 "${challenge.teamwork}" 업무를 마쳤어요. 동료들이 회식을 제안했는데, 내일도 "${challenge.task}" 일정이 있어요. 어떻게 할까요?`;
    } else if (sc.id === "praise") {
      title = `${job.name} 업무에 대한 칭찬`;
      desc = `"${challenge.task}" 업무를 잘했다며 팀장님이 동료들 앞에서 칭찬해주셨어요. 어떻게 반응할까요?`;
    }
    return { ...sc, id, title, desc, choices };
  });

  return roleScenarios;
}

function completedWorkScenarioCount(scenarios = getWorkScenarios()) {
  return scenarios.filter((sc) => state.answers[sc.id] !== undefined).length;
}

function totalSpent() {
  return CATEGORIES.reduce((sum, c) => sum + (state.spent[c.id] || 0), 0);
}
function usedTotal() {
  return getHousingCost() + totalSpent() + state.savings;
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2400);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

/* ---------------- 화면 전환 ---------------- */

function showView(name) {
  state.view = name;
  saveState();

  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  const target = $("#view-" + name);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === name);
  });

  renderView(name);
  window.scrollTo({ top: 0 });
}

function renderView(name) {
  if (name === "setup") renderSetup();
  else if (name === "money") renderMoney();
  else if (name === "work") renderWork();
  else if (name === "result") renderResult();
}

/* ---------------- 2. 사회생활 시작 ---------------- */

function optionCardHtml(type, item, selected) {
  let tag = "";
  if (type === "salary") tag = `<span class="option-tag">월 ${man(item.amount)}</span>`;
  if (type === "housing") tag = `<span class="option-tag">기본 주거비 ${man(item.fixed)} · 초기자산 ${man(item.asset)}</span>`;
  return `
    <button type="button" class="option-card ${selected ? "selected" : ""}"
      data-opt-type="${type}" data-opt-id="${item.id}">
      <span class="option-emoji">${item.emoji}</span><span class="option-name">${item.name}</span>
      <span class="option-desc">${item.desc}</span>
      ${tag}
    </button>`;
}

function renderSetup() {
  const form = $("#setup-form");
  const doneBox = $("#setup-done-box");

  if (state.started) {
    form.hidden = true;
    if (doneBox) doneBox.hidden = false;
    const j = getJob(), s = getSalary(), h = getHousing();
    const el = $("#setup-current");
    if (el && j && s && h) {
      el.innerHTML = `
        <div class="preview-item"><div class="k">이름</div><div class="v">${escapeHtml(state.setup.name)}님</div></div>
        <div class="preview-item"><div class="k">직업</div><div class="v">${j.emoji} ${j.name}</div></div>
        <div class="preview-item"><div class="k">월급</div><div class="v money">${fmtW(s.amount)}</div></div>
        <div class="preview-item"><div class="k">주거 형태</div><div class="v">${h.emoji} ${h.name}</div></div>
        <div class="preview-item"><div class="k">매달 주거비</div><div class="v">${fmtW(getHousingCost())}</div></div>`;
    }
    return;
  }
  form.hidden = false;
  if (doneBox) doneBox.hidden = true;

  $("#job-list").innerHTML = JOB_CATEGORIES.map((category) => `
    <section class="job-category">
      <h3 class="job-category-title">${category.name}</h3>
      <div class="option-grid">
        ${category.jobs.map((j) => optionCardHtml("job", j, state.setup.jobId === j.id)).join("")}
      </div>
    </section>`).join("");
  $("#salary-list").innerHTML = SALARIES.map((s) => optionCardHtml("salary", s, state.setup.salaryId === s.id)).join("");
  $("#housing-list").innerHTML = HOUSINGS.map((h) => optionCardHtml("housing", h, state.setup.housingId === h.id)).join("");

  if (!$("#input-name").value) $("#input-name").value = state.setup.name || "";

  const costRow = $("#cost-row");
  if (costRow) costRow.hidden = !state.setup.housingId;
  const costInput = $("#housing-cost");
  if (costInput) costInput.value = Math.round(getHousingCost() / 10000);

  renderPreview();
}

function renderPreview() {
  const box = $("#setup-preview");
  const j = getJob(), s = getSalary(), h = getHousing();
  if (!j || !s || !h) {
    box.innerHTML = `<p class="preview-empty">직업 · 월급 · 주거 형태를 모두 선택하면 요약이 표시돼요.</p>`;
    return;
  }
  const cost = getHousingCost();
  const firstMoney = s.amount - cost;
  box.innerHTML = `
    <div class="preview-grid">
      <div class="preview-item"><div class="k">직업</div><div class="v">${j.emoji} ${j.name}</div></div>
      <div class="preview-item"><div class="k">월급</div><div class="v money">${fmtW(s.amount)}</div></div>
      <div class="preview-item"><div class="k">주거 형태</div><div class="v">${h.emoji} ${h.name}</div></div>
      <div class="preview-item"><div class="k">초기 자산</div><div class="v money">${fmtW(h.asset)}</div></div>
      <div class="preview-item"><div class="k">매달 주거비</div><div class="v">${fmtW(cost)}</div></div>
      <div class="preview-item"><div class="k">월급에서 남을 돈</div><div class="v">${fmtW(firstMoney)}</div></div>
    </div>`;
}

function startSimulation() {
  const name = $("#input-name").value.trim();
  if (!name) { toast("이름을 입력해주세요!"); $("#input-name").focus(); return; }
  if (!state.setup.jobId) { toast("직업을 선택해주세요!"); return; }
  if (!state.setup.salaryId) { toast("월급을 선택해주세요!"); return; }
  if (!state.setup.housingId) { toast("주거 형태를 선택해주세요!"); return; }

  const s = getSalary(), h = getHousing();
  const cost = getHousingCost();
  state.setup.name = name;
  state.started = true;
  state.asset = h.asset;
  state.monthBalance = s.amount - cost;
  state.weeklyBudget = Math.floor(state.monthBalance / 4);
  state.balance = state.weeklyBudget;
  state.weeklyReserve = state.monthBalance - state.balance;
  state.savings = 0;
  state.spent = { food: 0, transport: 0, phone: 0, leisure: 0 };
  state.weekSpent = { food: 0, transport: 0, phone: 0, leisure: 0 };
  state.workScore = 50;
  state.answers = {};
  state.log = [{ type: "fixed", catId: "housing", label: `${h.name} 주거비 (고정지출)`, amount: cost }];
  state.stocks = defaultState().stocks;
  STOCKS.forEach((s) => { state.stocks.prices[s.id] = [s.base]; });
  state.stocks.news = "📰 새로운 한 달, 주식 시장이 열렸어요!";
  saveState();
  showView("money");
  toast(`${name}님, 사회생활 시작! 첫 월급이 들어왔어요 🎉`);
}

/* ---------------- 3. 돈 관리 ---------------- */

function renderMoney() {
  const started = state.started;
  $("#money-need-setup").hidden = started;
  $("#money-content").hidden = !started;
  if (!started) return;

  const sal = getSalary(), h = getHousing(), j = getJob();
  $("#money-greet").textContent = `${state.setup.name}님의 한 달 (${j.name} · ${h.name})`;

  const spentSum = totalSpent();
  const totalAsset = state.asset + state.monthBalance + state.savings + stockValue();
  $("#money-summary").innerHTML = `
    <div class="summary-item"><div class="k">💼 월급</div><div class="v v-blue">${fmtW(sal.amount)}</div><div class="s">매달 들어오는 돈</div></div>
    <div class="summary-item"><div class="k">🪙 이번 주 생활비</div><div class="v ${state.balance < 0 ? "v-red" : ""}">${fmtW(state.balance)}</div><div class="s">${state.stocks.week}주차에 쓸 수 있는 돈</div></div>
    <div class="summary-item"><div class="k">🐷 저축액</div><div class="v v-green">${fmtW(state.savings)}</div><div class="s">차곡차곡 모은 돈</div></div>
    <div class="summary-item"><div class="k">🏦 총 자산</div><div class="v">${fmtW(totalAsset)}</div><div class="s">통장+월 잔액+저축+주식</div></div>`;

  const ratio = sal.amount > 0 ? Math.round((usedTotal() / sal.amount) * 100) : 0;
  $("#money-used-ratio").textContent = `월급의 ${clamp(ratio, 0, 150)}% 사용`;
  $("#money-bar").style.width = clamp(ratio, 0, 100) + "%";
  $("#money-warning").hidden = state.balance > 0;

  $("#money-categories").innerHTML =
    CATEGORIES.map((c) => categoryCardHtml(c)).join("") +
    savingCardHtml();

  renderStocks();
  renderLog();
}

function categoryCardHtml(c) {
  const spent = state.weekSpent[c.id] || 0;
  const monthSpent = state.spent[c.id] || 0;
  return `
    <div class="category-card">
      <div class="category-head">
        <span class="category-emoji">${c.emoji}</span>
        <span class="category-name">${c.name}</span>
         <span class="category-spent">이번 주 ${fmtW(spent)} 사용</span>
      </div>
      <p class="category-desc">${c.desc} · 이번 달 누적 ${fmtW(monthSpent)}</p>
      <div class="category-btns">
        ${c.presets.map(([amt, label]) =>
          `<button type="button" class="btn-mini" data-spend="${c.id}" data-amount="${amt}">${label}<br>${man(amt)}</button>`
        ).join("")}
      </div>
    </div>`;
}

function savingCardHtml() {
  return `
    <div class="category-card saving-card">
      <div class="category-head">
        <span class="category-emoji">🐷</span>
        <span class="category-name">저축</span>
        <span class="category-spent" style="background:var(--c-green-soft);color:var(--c-green)">${fmtW(state.savings)} 모음</span>
      </div>
  <p class="category-desc">월급의 20~30%를 저축하면 아주 훌륭해요! 저축한 돈은 이번 주 생활비에서 빠져요.</p>
      <div class="category-btns">
        <button type="button" class="btn-mini btn-mini-green" data-save="100000">조금 ${man(100000)}</button>
        <button type="button" class="btn-mini btn-mini-green" data-save="300000">보통 ${man(300000)}</button>
        <button type="button" class="btn-mini btn-mini-green" data-save="500000">많이 ${man(500000)}</button>
        <span class="save-custom">
          <input id="save-custom-input" class="saving-input" type="number" min="1" step="1" placeholder="직접 입력(만원)" />
          <button type="button" class="btn-mini btn-mini-green" id="btn-save-custom">저축하기</button>
        </span>
      </div>
    </div>`;
}

function renderLog() {
  const list = $("#money-log");
  if (!state.log.length) {
    list.innerHTML = `<li class="log-empty">아직 기록이 없어요. 위에서 돈을 사용해보세요!</li>`;
    return;
  }
  list.innerHTML = state.log.slice().reverse().slice(0, 15).map((e) => {
    const cat = getCat(e.catId);
    const icon = e.type === "save" ? "🐷"
      : (e.type === "invest" || e.type === "income") ? "📈"
      : e.type === "work" ? "💼"
      : e.type === "fixed" ? "🏡"
      : cat ? cat.emoji : "💳";
    let right;
    if (e.type === "save") right = `<span class="log-amount plus">→ 저축 ${fmtW(e.amount)}</span>`;
    else if (e.type === "income") right = `<span class="log-amount plus">+${fmtW(e.amount)}</span>`;
    else right = `<span class="log-amount minus">-${fmtW(e.amount)}</span>`;
    return `<li><span class="log-what"><span class="log-cat">${icon}</span>${escapeHtml(e.label)}</span>${right}</li>`;
  }).join("");
}

function doSpend(catId, amount) {
  const cat = getCat(catId);
  const preset = cat.presets.find(([a]) => a === amount);
  const label = preset ? preset[1] : "지출";
  if (amount > state.balance) { toast("남은 돈이 부족해요!"); return; }
  if (amount > state.monthBalance) { toast("이번 달 남은 생활비가 부족해요!"); return; }
  state.balance -= amount;
  state.monthBalance -= amount;
  state.spent[catId] += amount;
  state.weekSpent[catId] += amount;
  state.log.push({ type: "spend", catId, label, amount });
  saveState();
  renderMoney();
  toast(`${cat.name} ${man(amount)} 사용! 이번 주 남은 돈 ${fmtW(state.balance)}`);
}

function doSave(amount) {
  if (amount <= 0) { toast("1만원 이상 입력해주세요!"); return; }
  if (amount > state.balance) { toast("남은 돈이 부족해요!"); return; }
  if (amount > state.monthBalance) { toast("이번 달 남은 생활비가 부족해요!"); return; }
  state.balance -= amount;
  state.monthBalance -= amount;
  state.savings += amount;
  state.log.push({ type: "save", catId: "saving", label: `${man(amount)} 저축`, amount });
  saveState();
  renderMoney();
  toast(`저축 성공! 총 저축액 ${fmtW(state.savings)} 🐷`);
}

function addIncome(label, amount) {
  state.balance += amount;
  state.monthBalance += amount;
  state.log.push({ type: "income", catId: "work", label, amount });
}

function subMoney(label, amount) {
  state.balance -= amount;
  state.monthBalance -= amount;
  state.log.push({ type: "work", catId: "work", label, amount });
}

/* ---------------- 3-1. 주식 투자 ---------------- */

function getStock(id) { return STOCKS.find((s) => s.id === id) || null; }

function stockPrice(id) {
  const hist = state.stocks.prices[id];
  return hist && hist.length ? hist[hist.length - 1] : 0;
}

function stockValue() {
  return STOCKS.reduce((sum, s) => {
    const h = state.stocks.holdings[s.id];
    return h && h.qty > 0 ? sum + h.qty * stockPrice(s.id) : sum;
  }, 0);
}

function stockNetInvested() {
  return state.stocks.investedTotal - state.stocks.returnedTotal;
}

function stockPnL() {
  return stockValue() - stockNetInvested();
}

function setStockSource(src) {
  state.stocks.source = src === "balance" ? "balance" : "asset";
  saveState();
  renderStocks();
}

function buyStock(id, qty) {
  const st = state.stocks;
  if (st.closed) { toast("장이 마감되어 거래할 수 없어요!"); return; }
  const s = getStock(id);
  if (!s || !qty || qty <= 0) return;
  const price = stockPrice(id);
  const cost = qty * price;
  if (st.source === "asset") {
    if (state.asset < cost) { toast("내 통장(초기 자산)에 돈이 부족해요!"); return; }
    state.asset -= cost;
  } else {
    if (state.balance < cost) { toast("이번 주 남은 돈이 부족해요!"); return; }
    if (state.monthBalance < cost) { toast("이번 달 남은 생활비가 부족해요!"); return; }
    state.balance -= cost;
    state.monthBalance -= cost;
  }
  const h = st.holdings[id] || { qty: 0, avg: 0 };
  h.avg = Math.round((h.avg * h.qty + cost) / (h.qty + qty));
  h.qty += qty;
  st.holdings[id] = h;
  st.investedTotal += cost;
  state.log.push({ type: "invest", catId: "stock", label: `주식 매수 · ${s.name} ${qty}주`, amount: cost });
  saveState();
  renderMoney();
  toast(`${s.emoji} ${s.name} ${qty}주 매수! ${fmtW(cost)} 사용`);
}

function sellStock(id, qty) {
  const st = state.stocks;
  if (st.closed) { toast("장이 마감되어 거래할 수 없어요!"); return; }
  const s = getStock(id);
  const h = st.holdings[id];
  if (!s || !h || h.qty <= 0) { toast("보유한 주식이 없어요!"); return; }
  const n = qty === "all" ? h.qty : Math.min(Number(qty) || 0, h.qty);
  if (n <= 0) { toast("판매할 수량을 확인해주세요!"); return; }
  const price = stockPrice(id);
  const proceeds = n * price;
  const pnl = Math.round((price - h.avg) * n);
  h.qty -= n;
  if (h.qty <= 0) delete st.holdings[id];
  state.asset += proceeds;
  st.returnedTotal += proceeds;
  state.log.push({ type: "income", catId: "stock", label: `주식 매도 · ${s.name} ${n}주`, amount: proceeds });
  saveState();
  renderMoney();
  toast(`${s.emoji} ${s.name} ${n}주 매도! ${pnl >= 0 ? `수익 +${fmtW(pnl)} 🎉` : `손실 ${fmtW(-pnl)} 😥`}`);
}

function nextWeek() {
  const st = state.stocks;
  if (st.closed) { toast("장이 마감되었어요!"); return; }

  STOCKS.forEach((s) => {
    const hist = st.prices[s.id];
    const cur = hist[hist.length - 1];
    const change = (Math.random() * 2 - 1) * s.vol;
    let np = Math.round((cur * (1 + change)) / 10) * 10;
    np = Math.max(Math.round(s.base * 0.2), np);
    hist.push(np);
  });

  if (Math.random() < 0.25) {
    const ev = STOCKS[Math.floor(Math.random() * STOCKS.length)];
    const hist = st.prices[ev.id];
    const cur = hist[hist.length - 1];
    const shock = 1 + (Math.random() < 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.1);
    hist[hist.length - 1] = Math.max(Math.round(ev.base * 0.2), Math.round((cur * shock) / 10) * 10);
  }

  if (st.week >= 4) {
    st.closed = true;
    st.news = "📰 4주차 종료! 이번 달 주식 시장이 마감되었어요.";
    toast("🔔 장 마감! 주식 투자 결과가 나의 결과에 반영돼요.");
  } else {
    st.week += 1;
    const weeklyPayout = Math.min(state.weeklyBudget, state.weeklyReserve);
    state.weeklyReserve -= weeklyPayout;
    state.balance += weeklyPayout;
    state.weekSpent = { food: 0, transport: 0, phone: 0, leisure: 0 };
    const movers = STOCKS.map((s) => {
      const hist = st.prices[s.id];
      const prev = hist[hist.length - 2];
      return { s, pct: (hist[hist.length - 1] - prev) / prev };
    }).sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct));
    const top = movers[0];
    st.news = top.pct >= 0
      ? `📰 ${top.s.emoji} ${top.s.name}이(가) ${(top.pct * 100).toFixed(1)}% 올랐어요!`
      : `📰 ${top.s.emoji} ${top.s.name}이(가) ${(Math.abs(top.pct) * 100).toFixed(1)}% 떨어졌어요...`;
    toast(`${st.week}주차 시작! 생활비 ${fmtW(weeklyPayout)}이 지급되고 주간 사용액이 초기화됐어요.`);
  }
  saveState();
  renderMoney();
}

function stockChangePct(s) {
  const hist = state.stocks.prices[s.id] || [];
  if (hist.length < 2) return null;
  const prev = hist[hist.length - 2];
  return (hist[hist.length - 1] - prev) / prev;
}

function sparkHtml(s) {
  const hist = state.stocks.prices[s.id] || [];
  if (!hist.length) return "";
  const max = Math.max(...hist);
  const min = Math.min(...hist);
  const range = max - min || 1;
  const bars = hist.map((p, i) => {
    const height = 20 + Math.round(((p - min) / range) * 80);
    const isLast = i === hist.length - 1;
    const cls = isLast ? (p >= hist[0] ? " up" : " down") : "";
    return `<i style="height:${height}%" class="${cls.trim()}"></i>`;
  }).join("");
  return `<span class="spark">${bars}</span>`;
}

function stockChangeBadge(s) {
  const pct = stockChangePct(s);
  if (pct === null) return `<span class="stock-change flat">🔓 시장 오픈</span>`;
  const p = pct * 100;
  if (p > 0) return `<span class="stock-change p-up">🔺 +${p.toFixed(1)}%</span>`;
  if (p < 0) return `<span class="stock-change p-down">🔻 ${p.toFixed(1)}%</span>`;
  return `<span class="stock-change flat">➖ 0.0%</span>`;
}

function stockItemHtml(s) {
  const st = state.stocks;
  const price = stockPrice(s.id);
  const h = st.holdings[s.id];
  const own = h && h.qty > 0;
  const ownPnl = own ? Math.round((price - h.avg) * h.qty) : 0;
  const tradeDisabled = st.closed ? " disabled" : "";

  const ownHtml = own
    ? `<div class="stock-own">보유 <b>${h.qty}주</b> · 평단 ${fmtW(h.avg)} · 평가 ${fmtW(h.qty * price)}
        <b class="${ownPnl >= 0 ? "p-up" : "p-down"}">${ownPnl >= 0 ? "+" : ""}${fmtW(ownPnl)}</b></div>`
    : `<div class="stock-own">보유 수량 없음</div>`;

  const sellBtns = own
    ? `<button type="button" class="btn-mini btn-sell" data-stock-sell="${s.id}" data-qty="1"${tradeDisabled}>1주 매도</button>
       <button type="button" class="btn-mini btn-sell" data-stock-sell="${s.id}" data-qty="all"${tradeDisabled}>전량 매도</button>`
    : "";

  return `
    <div class="stock-item">
      <div class="stock-item-head">
        <span class="stock-emoji">${s.emoji}</span>
        <div class="stock-meta">
          <span class="stock-name">${s.name}</span>
          <span class="stock-desc">${s.desc}</span>
        </div>
        ${stockChangeBadge(s)}
      </div>
      <div class="stock-price-row">
        <span class="stock-price">${fmtW(price)}</span>
        ${sparkHtml(s)}
      </div>
      ${ownHtml}
      <div class="stock-btns">
        <button type="button" class="btn-mini" data-stock-buy="${s.id}" data-qty="1"${tradeDisabled}>1주</button>
        <button type="button" class="btn-mini" data-stock-buy="${s.id}" data-qty="5"${tradeDisabled}>5주</button>
        <button type="button" class="btn-mini" data-stock-buy="${s.id}" data-qty="10"${tradeDisabled}>10주</button>
        ${sellBtns}
      </div>
    </div>`;
}

function renderStocks() {
  const box = $("#stock-section");
  if (!box) return;
  const st = state.stocks;
  const invested = st.investedTotal > 0;
  const pnl = stockPnL();
  const pnlChip = invested
    ? `<span class="stock-pnl ${pnl > 0 ? "p-up" : pnl < 0 ? "p-down" : "flat"}">${pnl >= 0 ? "▲" : "▼"} 투자 손익 ${pnl >= 0 ? "+" : ""}${fmtW(pnl)}</span>`
    : `<span class="stock-pnl flat">아직 투자 전</span>`;

  const sourceChips = `
    <span class="stock-toolbar-label">매수할 돈:</span>
    <button type="button" class="chip-btn ${st.source === "asset" ? "selected" : ""}" data-stock-source="asset">🏦 내 통장 ${fmtW(state.asset)}</button>
    <button type="button" class="chip-btn ${st.source === "balance" ? "selected" : ""}" data-stock-source="balance">🪙 이번 주 남은 돈 ${fmtW(state.balance)}</button>
    <button type="button" class="btn-mini btn-next" data-stock-next${st.closed ? " disabled" : ""}>${st.closed ? "장 마감" : `${st.week}주 → 다음 주 · 생활비 받기 ▶`}</button>`;

  const closedBanner = st.closed
    ? `<div class="market-banner">🔔 이번 달 주식 시장이 마감되었어요. 최종 평가액이 나의 결과에 반영돼요.</div>`
    : "";

  box.innerHTML = `
    <div class="card stock-card">
      <div class="stock-head">
        <h2 class="card-title">📈 주식 시장 <span class="stock-week-badge">${st.week}주차 / 4주</span></h2>
        ${pnlChip}
      </div>
      <p class="news-line">${escapeHtml(st.news || "📰 오늘의 주식 뉴스를 기다리는 중...")}</p>
      <div class="bar"><div class="bar-fill bar-blue" style="width:${(st.week / 4) * 100}%"></div></div>
      <p class="bar-help">한 달(4주) 동안 주가가 매주 변해요. 싸게 사서 비싸게 파는 게 목표! 단, 주가는 오르락내리락 — 투자에는 항상 위험이 따라요.</p>
      <div class="stock-toolbar">${sourceChips}</div>
      <div class="stock-grid">${STOCKS.map((s) => stockItemHtml(s)).join("")}</div>
      ${closedBanner}
    </div>`;
}

/* ---------------- 4. 직장생활 ---------------- */

function renderWork() {
  const started = state.started;
  $("#work-need-setup").hidden = started;
  $("#work-content").hidden = !started;
  if (!started) return;

  const score = state.workScore;
  $("#work-score-text").textContent = `${score}점 / 100점`;
  $("#work-meter").style.width = score + "%";

  const scenarios = getWorkScenarios();
  const doneCount = completedWorkScenarioCount(scenarios);
  $("#work-progress").textContent =
    `${doneCount}/${scenarios.length}개 상황 완료 · 모든 질문이 ${getJob().name} 직무에 맞춰져 있어요!`;

  $("#work-list").innerHTML = scenarios.map((sc) => situationHtml(sc)).join("");
  $("#work-done-box").hidden = doneCount < scenarios.length;
}

function situationHtml(sc) {
  const picked = state.answers[sc.id];
  const isDone = picked !== undefined;
  const choice = isDone ? sc.choices[picked] : null;

  const choicesHtml = sc.choices.map((c, i) => {
    let cls = "choice-btn";
    if (isDone) {
      if (i === picked) cls += " picked";
      else cls += " dim";
      return `<button type="button" class="${cls}" disabled>${escapeHtml(c.label)}</button>`;
    }
    return `<button type="button" class="${cls}" data-scen="${sc.id}" data-choice="${i}">${escapeHtml(c.label)}</button>`;
  }).join("");

  let resultHtml = "";
  if (isDone && choice) {
    const tone = choice.tone === "good" ? "good" : choice.tone === "bad" ? "bad" : "";
    const fxParts = [];
    fxParts.push(`<span class="fx ${choice.points >= 0 ? "fx-plus" : "fx-minus"}">점수 ${choice.points >= 0 ? "+" : ""}${choice.points}점</span>`);
    if (choice.money > 0) fxParts.push(`<span class="fx fx-plus">+${fmtW(choice.money)} (${choice.moneyLabel})</span>`);
    if (choice.money < 0) fxParts.push(`<span class="fx fx-minus">-${fmtW(-choice.money)} (${choice.moneyLabel})</span>`);
    resultHtml = `
      <div class="situation-result ${tone}">
        ${escapeHtml(choice.result)}
        <span class="fx">${fxParts.join(" · ")}</span>
      </div>`;
  }

  return `
    <div class="situation-card ${isDone ? "done" : ""}">
      <div class="situation-head">
        <span class="situation-emoji">${sc.emoji}</span>
        <span class="situation-title">${sc.title}</span>
        <span class="situation-badge">${isDone ? "완료 ✔" : "미해결"}</span>
      </div>
      <p class="situation-desc">${sc.desc}</p>
      <div class="choice-list">${choicesHtml}</div>
      ${resultHtml}
    </div>`;
}

function pickChoice(scenId, idx) {
  if (state.answers[scenId] !== undefined) return;
  const sc = getWorkScenarios().find((s) => s.id === scenId);
  if (!sc) return;
  const choice = sc.choices[idx];
  if (!choice) return;

  state.answers[scenId] = idx;
  state.workScore = clamp(state.workScore + choice.points, 0, 100);

  if (choice.money > 0) addIncome(choice.moneyLabel || "수입", choice.money);
  else if (choice.money < 0) subMoney(choice.moneyLabel || "지출", -choice.money);

  saveState();
  renderWork();
  renderMoney(); // 요약 화면 수치 동기화
  if (state.balance < 0) toast("이번 주 남은 돈이 마이너스가 되었어요! 카드값처럼 다음에 부담돼요 😥");
}

/* ---------------- 5. 나의 결과 ---------------- */

function starsHtml(score) {
  const on = clamp(Math.round(score / 20), 0, 5);
  let s = "";
  for (let i = 0; i < 5; i++) s += `<span class="${i < on ? "on" : ""}">★</span>`;
  return s;
}

function calcScores() {
  const sal = getSalary();
  const salary = sal ? sal.amount : 1;
  const spentSum = totalSpent();
  const leisureR = state.spent.leisure / salary;
  const foodR = state.spent.food / salary;

  // 소비습관
  let consumption = 100;
  if (leisureR > 0.3) consumption -= 35;
  else if (leisureR > 0.2) consumption -= 25;
  else if (leisureR > 0.1) consumption -= 12;
  if (foodR > 0.3) consumption -= 20;
  else if (foodR > 0.2) consumption -= 10;
    if (state.monthBalance < 0) consumption -= 20;
  consumption = clamp(consumption, 0, 100);

  // 저축
  const saveR = state.savings / salary;
  let saving;
  if (saveR >= 0.3) saving = 100;
  else if (saveR >= 0.2) saving = 85;
  else if (saveR >= 0.1) saving = 70;
  else if (saveR > 0) saving = 50;
  else saving = 20;

  // 직장생활
  const work = clamp(state.workScore, 0, 100);

  // 생활관리
  const balR = state.monthBalance / salary;
  let life;
  if (state.monthBalance < 0) life = 20;
  else if (balR >= 0.2) life = 90;
  else if (balR >= 0.1) life = 75;
  else if (state.monthBalance > 0) life = 60;
  else life = 45;
  if (state.savings > 0) life = clamp(life + 10, 0, 100);
  if (state.stocks.investedTotal > 0) {
    const pnl = stockPnL();
    life = clamp(life + (pnl > 0 ? 5 : pnl < 0 ? -5 : 0), 0, 100);
  }

  const noSpend = spentSum === 0 && state.savings === 0;
  const avg = Math.round((consumption + saving + work + life) / 4);
  const grade = avg >= 90 ? "A+" : avg >= 80 ? "A" : avg >= 70 ? "B+" : avg >= 60 ? "B" : avg >= 50 ? "C" : "D";

  return { consumption, saving, work, life, avg, grade, noSpend };
}

function bandComment(score, comments) {
  if (score >= 90) return comments[0];
  if (score >= 70) return comments[1];
  if (score >= 50) return comments[2];
  return comments[3];
}

function renderResult() {
  const started = state.started;
  const answered = completedWorkScenarioCount();
  const scenarioCount = getWorkScenarios().length;
  const allWorkScenariosDone = answered === scenarioCount;
  $("#result-need-setup").hidden = started;
  $("#result-need-work").hidden = !started || allWorkScenariosDone;
  $("#result-content").hidden = !started || !allWorkScenariosDone;
  if (!started || !allWorkScenariosDone) {
    if (started) {
      $("#result-work-progress").textContent =
        `직장생활 상황 ${scenarioCount}개 중 ${answered}개를 해결했어요. 모두 해결하면 결과를 확인할 수 있어요!`;
    }
    return;
  }

  const sc = calcScores();
  const cards = [
    { emoji: "💳", name: "소비습관", score: sc.consumption,
      comment: bandComment(sc.consumption, [
        "충동 소비 없이 계획적으로 잘 썼어요!",
        "대체로 알맞게 소비했어요. 여가·식비 지출만 조금 더 신경 쓰면 좋아요!",
        "여가와 편의에 돈을 많이 썼어요. 다음엔 소비 예산을 정해보세요.",
        "한 달 돈이 너무 빠르게 사라졌어요! 소비 습관 점검이 필요해요.",
      ]) },
    { emoji: "🐷", name: "저축", score: sc.saving,
      comment: bandComment(sc.saving, [
        "월급의 30% 이상 저축! 부자 습관 1등이에요.",
        "훌륭한 저축 습관이에요. 이대로만 유지해요!",
        "조금씩이라도 저축한 게 대단해요. 목표 금액을 정하면 더 좋아요.",
        "저축을 시작해보세요. 월급의 10%부터가 가장 쉬워요.",
      ]) },
    { emoji: "💼", name: "직장생활", score: sc.work,
      comment: bandComment(sc.work, [
        "직장인 3년차 같은 현명한 대처! 신뢰받는 신입이에요.",
        "무난하고 안정적인 직장생활이었어요.",
        "실수도 배움! 상황을 좀 더 신중하게 판단해보세요.",
        "직장에서는 신중함과 소통이 중요해요. 다시 연습해봐요!",
      ]) },
    { emoji: "🧹", name: "생활관리", score: sc.life,
      comment: bandComment(sc.life, [
        "돈을 여유 있게 관리했어요. 계획적인 한 달!",
        "큰 무리 없이 한 달을 잘 보냈어요.",
        "빠듯하지만 한 달을 마무리했어요. 다음엔 여유를 만들어봐요!",
        "통장이 바닥났어요... 고정 지출과 소비 계획을 다시 세워봐요.",
      ]) },
  ];

  $("#result-cards").innerHTML = cards.map((c) => `
    <div class="result-card">
      <div class="result-card-head">
        <span class="result-emoji">${c.emoji}</span>
        <span class="result-name">${c.name}</span>
        <span class="result-score">${c.score}점</span>
      </div>
      <div class="stars">${starsHtml(c.score)}</div>
      <p class="result-comment">${c.comment}</p>
    </div>`).join("");

  $("#result-summary").innerHTML = buildSummary(sc);
}

function buildSummary(sc) {
  const j = getJob(), sal = getSalary(), h = getHousing();
  const name = state.setup.name || "김시뮬";
  const spentSum = totalSpent();
  const answered = completedWorkScenarioCount();
  const scenarioCount = getWorkScenarios().length;
  const lines = [];

  lines.push(`<b>${escapeHtml(name)}</b>님은 <b>${j.name}</b>(으)로 <b>${h.name}</b>에서 한 달을 살았어요.`);
  lines.push(`월급 <b>${fmtW(sal.amount)}</b> 중 주거비 <b>${fmtW(getHousingCost())}</b>이 빠졌고, 생활비로 <b>${fmtW(spentSum)}</b>을 사용했어요.`);
  lines.push(state.savings > 0
    ? `저축통장에는 <b>${fmtW(state.savings)}</b>이 차곡차곡 쌓였어요.`
    : `아쉽게도 이번 달에는 저축하지 못했어요.`);
  if (state.stocks.investedTotal > 0) {
    const pnl = stockPnL();
    const netInv = stockNetInvested();
    const rate = netInv > 0 ? Math.round((pnl / netInv) * 100) : null;
    const rateTxt = rate === null ? "" : ` (수익률 ${pnl >= 0 ? "+" : ""}${rate}%)`;
    lines.push(pnl >= 0
      ? `📈 주식 투자로 <b>${fmtW(pnl)}</b>을(를) 벌었어요!${rateTxt}`
      : `📉 주식 투자에서 <b>${fmtW(-pnl)}</b>을(를) 잃었어요...${rateTxt}`);
  }
  lines.push(state.monthBalance >= 0
    ? `이번 달 생활비 중 <b>${fmtW(state.monthBalance)}</b>이 남았어요.`
    : `이번 달 생활비가 <b>${fmtW(-state.monthBalance)}</b> 부족했어요. 마이너스 통장 조심!`);

  if (sc.noSpend) lines.push("아직 돈을 쓰거나 저축한 기록이 없어요. <b>돈 관리</b> 메뉴에서 한 달을 계획해보세요!");
  if (answered < scenarioCount) lines.push(`직장 상황은 ${answered}/${scenarioCount}개를 경험했어요. 모두 해결하면 더 정확한 결과를 볼 수 있어요.`);

  const finalComment = {
    "A+": "이미 사회생활 준비가 완료된 신입이에요!",
    A: "조금만 더 다듬으면 훌륭한 사회인이 될 수 있어요!",
    "B+": "사회생활의 기초를 착실히 배우는 중이에요!",
    B: "실수하면서 배우는 중! 다시 한번 도전해보세요.",
    C: "아직은 연습 중이니 걱정 마세요. 계획이 답이에요!",
    D: "지금은 연습 기간! 다시 시작하면 분명 나아져요.",
  }[sc.grade];

  lines.push(`종합 등급은 <b>${sc.grade}</b>! ${finalComment}`);
  return lines.map((l) => `${l}<br/>`).join("\n");
}

/* ---------------- 초기화 / 리셋 ---------------- */

function resetAll() {
  if (!confirm("정말 새로 시작할까요? 지금까지의 진행 상황이 모두 지워져요.")) return;
  state = defaultState();
  saveState();
  showView("home");
  toast("새로운 시뮬레이션을 준비했어요!");
}

/* ---------------- 이벤트 바인딩 ---------------- */

function bindEvents() {
  // 메뉴 이동 (상단 nav + 홈 메뉴 카드 + 각종 data-view 버튼)
  document.body.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view]");
    if (viewBtn) { showView(viewBtn.dataset.view); return; }

    // 설정 선택 카드
    const opt = e.target.closest("[data-opt-type]");
    if (opt) {
      const t = opt.dataset.optType, id = opt.dataset.optId;
      if (t === "job") state.setup.jobId = id;
      else if (t === "salary") state.setup.salaryId = id;
      else if (t === "housing") {
        state.setup.housingId = id;
        const hSel = HOUSINGS.find((x) => x.id === id);
        if (hSel) state.setup.housingCost = hSel.fixed; // 주거 형태 변경 시 기본 주거비로 초기화
      }
      saveState();
      renderSetup();
      return;
    }

    // 지출 버튼
    const spend = e.target.closest("[data-spend]");
    if (spend) { doSpend(spend.dataset.spend, Number(spend.dataset.amount)); return; }

    // 저축 버튼
    const sv = e.target.closest("[data-save]");
    if (sv) { doSave(Number(sv.dataset.save)); return; }

    // 주식: 출금 소스 선택
    const srcBtn = e.target.closest("[data-stock-source]");
    if (srcBtn) { setStockSource(srcBtn.dataset.stockSource); return; }

    // 주식: 매수 / 매도 / 다음 주
    const buyBtn = e.target.closest("[data-stock-buy]");
    if (buyBtn) { buyStock(buyBtn.dataset.stockBuy, Number(buyBtn.dataset.qty)); return; }

    const sellBtn = e.target.closest("[data-stock-sell]");
    if (sellBtn) { sellStock(sellBtn.dataset.stockSell, sellBtn.dataset.qty); return; }

    const nextBtn = e.target.closest("[data-stock-next]");
    if (nextBtn) { nextWeek(); return; }

    // 직장생활 선택지
    const ch = e.target.closest("[data-scen]");
    if (ch) { pickChoice(ch.dataset.scen, Number(ch.dataset.choice)); return; }
  });

  // 이름 입력 실시간 저장
  $("#input-name").addEventListener("input", (e) => {
    state.setup.name = e.target.value.trim();
    saveState();
  });

  // 주거비 직접 입력 (만원 단위, 0~100만원)
  $("#housing-cost").addEventListener("input", (e) => {
    const v = Number(e.target.value);
    if (e.target.value === "" || !Number.isFinite(v)) return;
    state.setup.housingCost = clamp(Math.round(v * 10000), 0, 1000000);
    saveState();
    renderPreview();
  });
  $("#housing-cost").addEventListener("change", (e) => {
    const v = Number(e.target.value) || 0;
    e.target.value = clamp(v, 0, 100);
    state.setup.housingCost = clamp(Math.round(v * 10000), 0, 1000000);
    saveState();
    renderPreview();
  });

  // 시뮬레이션 시작
  $("#setup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    startSimulation();
  });

  // 직접 입력 저축
  $("#money-content").addEventListener("click", (e) => {
    if (e.target.closest("#btn-save-custom")) {
      const input = $("#save-custom-input");
      const manWon = Number(input.value);
      if (!manWon || manWon <= 0) { toast("저축할 금액을 입력해주세요!"); input.focus(); return; }
      doSave(manWon * 10000);
      input.value = "";
    }
  });

  // 홈 히어로 버튼
  $("#btn-hero-start").addEventListener("click", () => showView("setup"));

  // 새로 시작 (결과 페이지 / 설정 페이지)
  $("#btn-restart").addEventListener("click", resetAll);
  $("#btn-restart-setup").addEventListener("click", resetAll);
}

function init() {
  loadState();
  bindEvents();

  // 시작 전 안내 박스 초기 상태
  $("#money-need-setup").hidden = state.started;
  $("#money-content").hidden = !state.started;
  $("#work-need-setup").hidden = state.started;
  $("#work-content").hidden = !state.started;
  $("#result-need-setup").hidden = state.started;
  $("#result-content").hidden = !state.started;

  showView(state.view || "home");
}

document.addEventListener("DOMContentLoaded", init);
