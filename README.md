방법: Vite 개발 서버로 실행
1. 터미널에서 frontend 폴더로 이동
cd "c:/Users/USER/OneDrive/Desktop/포트폴리오/frontend"



npm run dev
실행 안될경우 npm install

그러면 http://localhost:5173 주소로 브라우저에서 UI가 정상 렌더링돼요.

------------------------------------안켜졌던 원인
왜 이렇게 된 거였냐면:

Vite는 src/main.jsx → src/App.jsx를 진입점으로 사용해요
npm create vite로 초기화하면 src/App.jsx에 Vite 기본 템플릿이 생성됨
핵심_portfolio.jsx는 같은 폴더에 있어도 아무 곳에서도 import하지 않으면 실행에 포함이 안 됨
지금 수정으로 src/App.jsx가 포트폴리오를 import해서 렌더링하도록 연결됨