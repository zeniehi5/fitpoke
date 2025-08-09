import { BrowserRouter, Route, Routes } from "react-router-dom";
import RecommendResult from "./pages/RecommendResult";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import CustomBuilder from "./pages/CustomBuilder";

function App() {
  return (
    <div className="min-h-screen w-full bg-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<InputForm />} />
          <Route path="/result" element={<RecommendResult />} />
          <Route path="/custom" element={<CustomBuilder />} />
        </Routes>
      </BrowserRouter>
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-600 opacity-90 whitespace-nowrap">
        © 2025 피트포케 · 건강한 포케, 맞춤형 식단 추천 서비스
      </footer>
    </div>
  );
}

export default App;
