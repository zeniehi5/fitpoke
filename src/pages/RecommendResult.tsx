import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Button } from "@/components/ui/button";
import { menus } from "@/data/menu";
import { recommendMenus } from "@/features/recommend/recommendMenu";
import {
  calculateBMI,
  calculateBMR,
  calculateRecommendedIntake,
  type Gender,
} from "@/utils/calculator";

export default function RecommendResult() {
  const navigate = useNavigate();
  const fullText = "딱 맞는 메뉴를 찾고 있어요...💭";
  const [displayedText, setDisplayedText] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
  });

  const location = useLocation();
  const userInfo = location.state as {
    age: number;
    gender: Gender;
    height: number;
    weight: number;
    goal: string;
  };

  const { age, gender, height, weight } = userInfo;

  const bmi = calculateBMI(height, weight);
  const bmr = calculateBMR(gender, height, weight, age);
  const recommendedIntake = calculateRecommendedIntake(bmr);

  const menuRecommendations = recommendMenus(menus, recommendedIntake);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-0 rounded-none border-none w-full min-h-screen">
        <div className="w-full min-h-screen">
          {/* background image */}
          <img
            src="https://cdn.imweb.me/thumbnail/20250706/a351a07bd7e7b.jpg"
            alt="Background"
            className="absolute inset-0 w-screen h-screen object-cover z-0"
          />

          {/* 중앙 정렬된 타자 효과 텍스트 */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="text-white text-xl font-medium whitespace-pre-wrap">
              {displayedText}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full min-h-screen p-0 border-none rounded-none">
      <div className="w-full min-h-screen">
        {/* 배경 이미지 */}
        <img
          src="https://cdn.imweb.me/thumbnail/20250706/a351a07bd7e7b.jpg"
          alt="Background"
          className="absolute inset-0 w-screen h-screen object-cover z-0"
        />

        {/* 오버레이 */}
        <div className="absolute inset-0 z-10 bg-black/30 flex flex-col items-center justify-center px-6 space-y-6">
          <Card className="bg-white/70 backdrop-blur-md p-6 rounded-lg max-w-lg w-full">
            <div ref={sliderRef} className="keen-slider">
              {menuRecommendations.map((menu, idx) => (
                <div
                  key={idx}
                  className="keen-slider__slide flex flex-col items-center"
                >
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                  <div className="text-lg font-semibold">{menu.name}</div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {menu.nutrition.calorie}kcal | 단백질{" "}
                      {menu.nutrition.protein}g | 탄수화물 {menu.nutrition.carb}
                      g | 지방 {menu.nutrition.fat}g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 계산 결과 카드 */}
          <Card className="bg-white/60 backdrop-blur-md p-4 rounded-lg max-w-lg w-full text-sm">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="font-medium">📊 BMI</span>
                <span>{bmi}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">🔥 BMR (기초 대사량)</span>
                <span>{bmr} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">🍽️ 권장 섭취량</span>
                <span>{recommendedIntake} kcal</span>
              </div>
            </div>
          </Card>

          {/* ✅ Card 아래에 위치하도록 배치 */}
          <Button
            variant="outline"
            className="w-full max-w-lg !bg-white !text-black hover:!bg-[#d8de69] focus-visible:outline-none focus-visible:ring-0 rounded-full shadow-lg transition-colors duration-300 text-base"
            onClick={() => navigate("/")}
          >
            메인 화면으로 돌아가기
          </Button>
        </div>
      </div>
    </Card>
  );
}
