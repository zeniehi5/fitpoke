import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { baseToppings } from "@/data/baseToppings";
import { mainToppings } from "@/data/mainToppings";
import type { BaseTopping, MainTopping, Topping } from "@/data/toppings";
import {
  calculateBMR,
  calculateRecommendedCalories,
  calculateBMI,
} from "@/utils/calculator";
import type { NutritionProgress, NutritionGoals } from "@/types/nutrition";
import { ChevronDown, User, Activity, Calculator } from "lucide-react";

interface SelectedTopping {
  topping: Topping;
  quantity: number;
}

export default function CustomBuilder() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;

  const [panelState, setPanelState] = useState<'expanded' | 'compact' | 'hidden'>('expanded');
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const [selectedBase, setSelectedBase] = useState<BaseTopping | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<SelectedTopping[]>(
    []
  );
  const [nutritionProgress, setNutritionProgress] = useState<NutritionProgress>(
    {
      current: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      goals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      percentages: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    }
  );

  const [userStats, setUserStats] = useState({
    bmi: 0,
    bmr: 0,
    dailyCalories: 0,
    bmiStatus: "",
  });

  useEffect(() => {
    if (!userData) {
      navigate("/form");
      return;
    }

    const bmi = calculateBMI(userData.height, userData.weight);
    const bmr = calculateBMR(
      userData.gender,
      userData.height,
      userData.weight,
      userData.age
    );
    const dailyCalories = calculateRecommendedCalories(
      bmr,
      userData.activityLevel
    );
    const perMealCalories = Math.round(dailyCalories / 2.5); // 하루 2.5끼 기준

    // BMI 상태 판단
    let bmiStatus = "";
    if (bmi < 18.5) bmiStatus = "저체중";
    else if (bmi < 23) bmiStatus = "정상";
    else if (bmi < 25) bmiStatus = "과체중";
    else if (bmi < 30) bmiStatus = "비만";
    else bmiStatus = "고도비만";

    setUserStats({
      bmi,
      bmr,
      dailyCalories,
      bmiStatus,
    });

    const perMealGoals: NutritionGoals = {
      calories: perMealCalories,
      protein: Math.round((perMealCalories * 0.3) / 4),
      carbs: Math.round((perMealCalories * 0.4) / 4),
      fat: Math.round((perMealCalories * 0.3) / 9),
      fiber: 10,
    };

    console.log('perMealCalories:', perMealCalories);
    console.log('perMealGoals:', perMealGoals);

    setNutritionProgress((prev) => ({
      ...prev,
      goals: perMealGoals,
    }));
  }, [userData, navigate]);

  useEffect(() => {
    calculateNutrition();
  }, [selectedBase, selectedToppings]);

  const calculateNutrition = () => {
    let current: NutritionGoals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    if (selectedBase) {
      current.calories += selectedBase.calories;
      current.protein += selectedBase.protein;
      current.carbs += selectedBase.carbs;
      current.fat += selectedBase.fat;
      current.fiber += selectedBase.fiber;
    }

    selectedToppings.forEach(({ topping }) => {
      current.calories += topping.calories;
      current.protein += topping.protein;
      current.carbs += topping.carbs;
      current.fat += topping.fat;
      current.fiber += topping.fiber;
    });

    const percentages = {
      calories: nutritionProgress.goals.calories > 0 ? Math.min(
        (current.calories / nutritionProgress.goals.calories) * 100,
        100
      ) : 0,
      protein: nutritionProgress.goals.protein > 0 ? Math.min(
        (current.protein / nutritionProgress.goals.protein) * 100,
        100
      ) : 0,
      carbs: nutritionProgress.goals.carbs > 0 ? Math.min(
        (current.carbs / nutritionProgress.goals.carbs) * 100,
        100
      ) : 0,
      fat: nutritionProgress.goals.fat > 0 ? Math.min((current.fat / nutritionProgress.goals.fat) * 100, 100) : 0,
      fiber: nutritionProgress.goals.fiber > 0 ? Math.min(
        (current.fiber / nutritionProgress.goals.fiber) * 100,
        100
      ) : 0,
    };

    setNutritionProgress((prev) => ({
      current,
      goals: prev.goals,
      percentages,
    }));
  };

  const handleBaseSelect = (base: BaseTopping) => {
    setSelectedBase(base);
  };

  const handleToppingToggle = (topping: MainTopping) => {
    const existingIndex = selectedToppings.findIndex(
      (t) => t.topping.id === topping.id
    );

    if (existingIndex >= 0) {
      setSelectedToppings((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedToppings((prev) => [...prev, { topping, quantity: 1 }]);
    }
  };

  const getProgressColor = (current: number, goal: number) => {
    const diff = Math.abs(current - goal);
    const tolerance = goal * 0.15; // 15% tolerance

    if (diff <= tolerance) {
      // 적정 범위 (±15%)
      return "bg-green-500";
    } else if (current < goal) {
      // 부족
      return "bg-yellow-500";
    } else {
      // 초과
      return "bg-blue-500";
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = currentY - startY;
    if (diff > 50) {
      // Swipe down - collapse to next state
      if (panelState === 'expanded') {
        setPanelState('compact');
      } else if (panelState === 'compact') {
        setPanelState('hidden');
      }
    } else if (diff < -50) {
      // Swipe up - expand to previous state
      if (panelState === 'hidden') {
        setPanelState('compact');
      } else if (panelState === 'compact') {
        setPanelState('expanded');
      }
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const diff = currentY - startY;
    if (diff > 50) {
      // Swipe down - collapse to next state
      if (panelState === 'expanded') {
        setPanelState('compact');
      } else if (panelState === 'compact') {
        setPanelState('hidden');
      }
    } else if (diff < -50) {
      // Swipe up - expand to previous state
      if (panelState === 'hidden') {
        setPanelState('compact');
      } else if (panelState === 'compact') {
        setPanelState('expanded');
      }
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* background image */}
      <img
        src="https://cdn.imweb.me/thumbnail/20250706/a351a07bd7e7b.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="flex items-center justify-center p-4 flex-shrink-0">
          <h1 className="text-base font-bold text-white text-center">
            커스텀 포케볼
          </h1>
        </div>

        <div
          className={`flex-1 container mx-auto px-4 max-w-7xl transition-all duration-500 ${
            panelState === 'expanded' ? "pb-4 opacity-30 pointer-events-none" : 
            panelState === 'compact' ? "pb-64 sm:pb-48" : 
            "pb-20 sm:pb-16"
          }`}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="pt-2">
              <Tabs defaultValue="base">
                <TabsList className="grid w-full grid-cols-2 mb-1">
                  <TabsTrigger
                    value="base"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:!bg-[#d8de69] data-[state=active]:!border-[#d8de69] data-[state=active]:!text-black"
                  >
                    베이스 선택
                  </TabsTrigger>
                  <TabsTrigger
                    value="toppings"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:!bg-[#d8de69] data-[state=active]:!border-[#d8de69] data-[state=active]:!text-black"
                  >
                    토핑 선택
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="base"
                  className="mt-4 max-h-[60vh] sm:max-h-96 overflow-y-auto pb-4"
                >
                  <h3 className="text-sm font-medium mb-4">
                    베이스를 선택해주세요 (1개 필수)
                  </h3>
                  <Tabs defaultValue="grain">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger
                        value="grain"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        곡물
                      </TabsTrigger>
                      <TabsTrigger
                        value="greens"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        채소
                      </TabsTrigger>
                      <TabsTrigger
                        value="noodle"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        면
                      </TabsTrigger>
                    </TabsList>
                    {["grain", "greens", "noodle"].map((category) => (
                      <TabsContent
                        key={category}
                        value={category}
                        className="grid grid-cols-3 gap-3 mt-2"
                      >
                        {baseToppings
                          .filter((base) => base.category === category)
                          .map((base) => {
                            const selected = selectedBase?.id === base.id;
                            return (
                              <div
                                key={base.id}
                                className="aspect-square cursor-pointer"
                                onClick={() => handleBaseSelect(base)}
                                style={{ perspective: "1000px" }}
                              >
                                <div
                                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                                    selected ? "rotate-y-180" : ""
                                  }`}
                                  style={{
                                    transformStyle: "preserve-3d",
                                    transform: selected
                                      ? "rotateY(180deg)"
                                      : "rotateY(0deg)",
                                  }}
                                >
                                  {/* 앞면 */}
                                  <div
                                    className={`absolute inset-0 p-3 border rounded-lg flex flex-col justify-between backface-hidden ${
                                      selected
                                        ? "border-[#d8de69] bg-[#d8de69]/10"
                                        : "hover:border-gray-400"
                                    }`}
                                    style={{ backfaceVisibility: "hidden" }}
                                  >
                                    <div className="space-y-1">
                                      <h4 className="font-semibold text-sm leading-tight">
                                        {base.name}
                                      </h4>
                                      {/* <p className="text-xs text-gray-600">
                                        단백질 {base.protein}g
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        탄수화물 {base.carbs}g
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        지방 {base.fat}g
                                      </p> */}
                                    </div>
                                  </div>

                                  {/* 뒷면 */}
                                  <div
                                    className="absolute inset-0 p-3 border border-[#d8de69] bg-[#d8de69]/10 rounded-lg flex flex-col justify-between backface-hidden"
                                    style={{
                                      backfaceVisibility: "hidden",
                                      transform: "rotateY(180deg)",
                                    }}
                                  >
                                    {base.image ? (
                                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                                        <img
                                          src={base.image}
                                          alt={base.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center">
                                          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                                            <span className="text-2xl">🍽️</span>
                                          </div>
                                          <h4 className="font-semibold text-xs text-primary truncate px-1 overflow-hidden">
                                            {base.name}
                                          </h4>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>

                <TabsContent
                  value="toppings"
                  className="mt-4 max-h-[60vh] sm:max-h-96 overflow-y-auto pb-4"
                >
                  <h3 className="text-sm font-medium mb-4">
                    토핑을 선택해주세요
                  </h3>
                  <Tabs defaultValue="protein">
                    <TabsList className="grid w-full grid-cols-5 mb-4">
                      <TabsTrigger
                        value="protein"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        단백질
                      </TabsTrigger>
                      <TabsTrigger
                        value="vegetable"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        야채
                      </TabsTrigger>
                      <TabsTrigger
                        value="cheese"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        치즈
                      </TabsTrigger>
                      <TabsTrigger
                        value="nuts"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        견과류
                      </TabsTrigger>
                      <TabsTrigger
                        value="fruit"
                        className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black"
                      >
                        과일
                      </TabsTrigger>
                    </TabsList>
                    {["protein", "vegetable", "cheese", "nuts", "fruit"].map(
                      (category) => (
                        <TabsContent
                          key={category}
                          value={category}
                          className="grid grid-cols-3 gap-3 mt-2"
                        >
                          {mainToppings
                            .filter((topping) => topping.category === category)
                            .map((topping) => {
                              const selected = selectedToppings.find(
                                (t) => t.topping.id === topping.id
                              );
                              return (
                                <div
                                  key={topping.id}
                                  className="aspect-square cursor-pointer"
                                  onClick={() => handleToppingToggle(topping)}
                                  style={{ perspective: "1000px" }}
                                >
                                  <div
                                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                                      selected ? "rotate-y-180" : ""
                                    }`}
                                    style={{
                                      transformStyle: "preserve-3d",
                                      transform: selected
                                        ? "rotateY(180deg)"
                                        : "rotateY(0deg)",
                                    }}
                                  >
                                    {/* 앞면 */}
                                    <div
                                      className={`absolute inset-0 p-3 border rounded-lg flex flex-col justify-between backface-hidden ${
                                        selected
                                          ? "border-[#d8de69] bg-[#d8de69]/10"
                                          : "hover:border-gray-400"
                                      }`}
                                      style={{ backfaceVisibility: "hidden" }}
                                    >
                                      <div className="space-y-1">
                                        <h4 className="font-semibold text-sm leading-tight">
                                          {topping.name}
                                        </h4>
                                        {/* <p className="text-xs text-gray-600">
                                          단백질 {topping.protein}g
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          탄수화물 {topping.carbs}g
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          지방 {topping.fat}g
                                        </p> */}
                                      </div>
                                    </div>

                                    {/* 뒷면 */}
                                    <div
                                      className="absolute inset-0 p-3 border border-[#d8de69] bg-[#d8de69]/10 rounded-lg flex flex-col justify-between backface-hidden"
                                      style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                      }}
                                    >
                                      {topping.image ? (
                                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                                          <img
                                            src={topping.image}
                                            alt={topping.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                          <div className="text-center">
                                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                                              <span className="text-2xl">
                                                🍽️
                                              </span>
                                            </div>
                                            <h4 className="font-semibold text-xs text-primary truncate px-1">
                                              {topping.name}
                                            </h4>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </TabsContent>
                      )
                    )}
                  </Tabs>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div
          ref={panelRef}
          className={`fixed left-0 right-0 transition-all duration-500 ease-in-out ${
            panelState === 'expanded' ? "top-20 bottom-0" : 
            panelState === 'compact' ? "bottom-0" :
            "bottom-0"
          }`}
          style={{
            background:
              "linear-gradient(to top, #ffffff 0%, #ffffff 70%, #f9fafb 100%)",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            boxShadow:
              "0 -20px 40px -5px rgba(0, 0, 0, 0.15), 0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)",
            transform: "translateZ(0)",
            height: panelState === 'expanded' ? "calc(100vh - 5rem)" : 
                   panelState === 'compact' ? "220px" : 
                   "80px",
            overflowY: "auto",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-t-3xl"></div>

          {/* Handle bar for dragging */}
          <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
          </div>

          {/* Collapse/Expand indicator */}
          <div className="flex justify-center pb-2">
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                panelState === 'expanded' ? "" : 
                panelState === 'compact' ? "rotate-90" : 
                "rotate-180"
              }`}
            />
          </div>

          <div className="container mx-auto px-6 pb-8 max-w-7xl">
            {/* User Stats Section - Only show when expanded */}
            {panelState === 'expanded' && userData && (
              <div className="mb-6 space-y-4">
                {/* User Info */}
                <div className="bg-white/90 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">내 정보</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">성별</span>
                      <span className="font-medium">
                        {userData.gender === "male" ? "남성" : "여성"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">나이</span>
                      <span className="font-medium">{userData.age}세</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">키</span>
                      <span className="font-medium">{userData.height}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">몸무게</span>
                      <span className="font-medium">{userData.weight}kg</span>
                    </div>
                  </div>
                </div>

                {/* BMI & Calculations */}
                <div className="bg-white/90 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">건강 지표</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">BMI 지수</span>
                      <div className="text-right">
                        <span className="font-bold text-lg">
                          {userStats.bmi}
                        </span>
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full ${
                            userStats.bmiStatus === "정상"
                              ? "bg-green-100 text-green-700"
                              : userStats.bmiStatus === "저체중"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {userStats.bmiStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        기초대사량 (BMR)
                      </span>
                      <span className="font-semibold">
                        {userStats.bmr} kcal
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        1일 권장 칼로리
                      </span>
                      <span className="font-semibold">
                        {userStats.dailyCalories} kcal
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        1끼 권장 칼로리
                      </span>
                      <span className="font-semibold text-primary">
                        {Math.round(userStats.dailyCalories / 2.5)} kcal
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Level */}
                <div className="bg-white/90 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">활동 수준</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">현재 활동량</span>
                    <span className="font-medium">
                      {userData.activityLevel === "sedentary" && "좌식 생활"}
                      {userData.activityLevel === "light" && "가벼운 활동"}
                      {userData.activityLevel === "moderate" && "보통 활동"}
                      {userData.activityLevel === "active" && "활발한 활동"}
                      {userData.activityLevel === "very-active" &&
                        "매우 활발한 활동"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-bold text-gray-800 tracking-wide mb-2">
                    영양 정보 (1끼 기준)
                  </h3>
                  <p className="text-xs text-gray-500">
                    하루 2.5끼 기준, 한 끼 권장량
                  </p>
                </div>
              </div>
            )}

            {/* Nutrition Progress Section - Show based on panel state */}
            {panelState !== 'hidden' && (
              <div className="space-y-3">
                {panelState === 'compact' && (
                <div className="text-center">
                  <h3 className="text-sm font-bold text-gray-800 tracking-wide">
                    영양 정보 (1끼 기준)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    하루 2.5끼 기준, 한 끼 권장량
                  </p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">단백질</span>
                    <span>
                      {nutritionProgress.current.protein.toFixed(1)}/
                      {nutritionProgress.goals.protein.toFixed(1)}g
                    </span>
                  </div>
                  <Progress
                    value={nutritionProgress.percentages.protein}
                    className="h-3"
                  />
                  <div
                    className={`h-3 -mt-3 rounded-full ${getProgressColor(
                      nutritionProgress.current.protein,
                      nutritionProgress.goals.protein
                    )} opacity-80`}
                    style={{
                      width: `${Math.min(
                        nutritionProgress.percentages.protein,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">탄수화물</span>
                    <span>
                      {nutritionProgress.current.carbs.toFixed(1)}/
                      {nutritionProgress.goals.carbs.toFixed(1)}g
                    </span>
                  </div>
                  <Progress
                    value={nutritionProgress.percentages.carbs}
                    className="h-3"
                  />
                  <div
                    className={`h-3 -mt-3 rounded-full ${getProgressColor(
                      nutritionProgress.current.carbs,
                      nutritionProgress.goals.carbs
                    )} opacity-80`}
                    style={{
                      width: `${Math.min(
                        nutritionProgress.percentages.carbs,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">지방</span>
                    <span>
                      {nutritionProgress.current.fat.toFixed(1)}/
                      {nutritionProgress.goals.fat.toFixed(1)}g
                    </span>
                  </div>
                  <Progress
                    value={nutritionProgress.percentages.fat}
                    className="h-3"
                  />
                  <div
                    className={`h-3 -mt-3 rounded-full ${getProgressColor(
                      nutritionProgress.current.fat,
                      nutritionProgress.goals.fat
                    )} opacity-80`}
                    style={{
                      width: `${Math.min(
                        nutritionProgress.percentages.fat,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
