import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { baseToppings } from "@/data/baseToppings";
import { mainToppings } from "@/data/mainToppings";
import type { BaseTopping, MainTopping, Topping } from "@/data/toppings";
import { calculateBMR, calculateRecommendedCalories } from "@/utils/calculator";
import type { NutritionProgress, NutritionGoals } from "@/types/nutrition";

interface SelectedTopping {
  topping: Topping;
  quantity: number;
}

export default function CustomBuilder() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;

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

  useEffect(() => {
    if (!userData) {
      navigate("/form");
      return;
    }

    const bmr = calculateBMR(
      userData.gender,
      userData.age,
      userData.height,
      userData.weight
    );
    const dailyCalories = calculateRecommendedCalories(
      bmr,
      userData.activityLevel
    );
    const perMealCalories = dailyCalories / 2.5; // 하루 2.5끼 기준

    const perMealGoals: NutritionGoals = {
      calories: perMealCalories,
      protein: (perMealCalories * 0.3) / 4,
      carbs: (perMealCalories * 0.4) / 4,
      fat: (perMealCalories * 0.3) / 9,
      fiber: 10,
    };

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
      calories: Math.min(
        (current.calories / nutritionProgress.goals.calories) * 100,
        100
      ),
      protein: Math.min(
        (current.protein / nutritionProgress.goals.protein) * 100,
        100
      ),
      carbs: Math.min(
        (current.carbs / nutritionProgress.goals.carbs) * 100,
        100
      ),
      fat: Math.min((current.fat / nutritionProgress.goals.fat) * 100, 100),
      fiber: Math.min(
        (current.fiber / nutritionProgress.goals.fiber) * 100,
        100
      ),
    };

    setNutritionProgress({
      current,
      goals: nutritionProgress.goals,
      percentages,
    });
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
          <h1 className="text-base font-bold text-white text-center">커스텀 포케볼</h1>
        </div>

        <div className="flex-1 container mx-auto px-4 max-w-7xl pb-40">
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
              
              <TabsContent value="base" className="mt-4 max-h-96 overflow-y-auto pb-4">
                <h3 className="text-sm font-medium mb-4">베이스를 선택해주세요 (1개 필수)</h3>
                <Tabs defaultValue="grain">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="grain" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">곡물</TabsTrigger>
                    <TabsTrigger value="greens" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">채소</TabsTrigger>
                    <TabsTrigger value="noodle" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">면</TabsTrigger>
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
                              style={{ perspective: '1000px' }}
                            >
                              <div
                                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                                  selected ? 'rotate-y-180' : ''
                                }`}
                                style={{
                                  transformStyle: 'preserve-3d',
                                  transform: selected ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                              >
                                {/* 앞면 */}
                                <div
                                  className={`absolute inset-0 p-3 border rounded-lg flex flex-col justify-between backface-hidden ${
                                    selected
                                      ? "border-[#d8de69] bg-[#d8de69]/10"
                                      : "hover:border-gray-400"
                                  }`}
                                  style={{ backfaceVisibility: 'hidden' }}
                                >
                                  <div className="space-y-1">
                                    <h4 className="font-semibold text-sm leading-tight">
                                      {base.name}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                      단백질 {base.protein}g
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      탄수화물 {base.carbs}g
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      지방 {base.fat}g
                                    </p>
                                  </div>
                                </div>

                                {/* 뒷면 */}
                                <div
                                  className="absolute inset-0 p-3 border border-[#d8de69] bg-[#d8de69]/10 rounded-lg flex flex-col justify-between backface-hidden"
                                  style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
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
              
              <TabsContent value="toppings" className="mt-4 max-h-96 overflow-y-auto pb-4">
                <h3 className="text-sm font-medium mb-4">토핑을 선택해주세요</h3>
                <Tabs defaultValue="protein">
                  <TabsList className="grid w-full grid-cols-5 mb-4">
                    <TabsTrigger value="protein" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">단백질</TabsTrigger>
                    <TabsTrigger value="vegetable" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">야채</TabsTrigger>
                    <TabsTrigger value="cheese" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">치즈</TabsTrigger>
                    <TabsTrigger value="nuts" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">견과류</TabsTrigger>
                    <TabsTrigger value="fruit" className="data-[state=active]:!bg-[#d8de69] data-[state=active]:!text-black">과일</TabsTrigger>
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
                                style={{ perspective: '1000px' }}
                              >
                                <div
                                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                                    selected ? 'rotate-y-180' : ''
                                  }`}
                                  style={{
                                    transformStyle: 'preserve-3d',
                                    transform: selected ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                  }}
                                >
                                  {/* 앞면 */}
                                  <div
                                    className={`absolute inset-0 p-3 border rounded-lg flex flex-col justify-between backface-hidden ${
                                      selected
                                        ? "border-[#d8de69] bg-[#d8de69]/10"
                                        : "hover:border-gray-400"
                                    }`}
                                    style={{ backfaceVisibility: 'hidden' }}
                                  >
                                    <div className="space-y-1">
                                      <h4 className="font-semibold text-sm leading-tight">
                                        {topping.name}
                                      </h4>
                                      <p className="text-xs text-gray-600">
                                        단백질 {topping.protein}g
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        탄수화물 {topping.carbs}g
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        지방 {topping.fat}g
                                      </p>
                                    </div>
                                  </div>

                                  {/* 뒷면 */}
                                  <div
                                    className="absolute inset-0 p-3 border border-[#d8de69] bg-[#d8de69]/10 rounded-lg flex flex-col justify-between backface-hidden"
                                    style={{
                                      backfaceVisibility: 'hidden',
                                      transform: 'rotateY(180deg)'
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
                                            <span className="text-2xl">🍽️</span>
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

      <div className="fixed bottom-0 left-0 right-0" style={{
        background: 'linear-gradient(to top, #ffffff 0%, #ffffff 70%, #f9fafb 100%)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -20px 40px -5px rgba(0, 0, 0, 0.15), 0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)',
        transform: 'translateZ(0)',
      }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-t-3xl"></div>
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-800 tracking-wide">영양 정보 (1끼 기준)</h3>
              <p className="text-xs text-gray-500 mt-1">
                하루 2.5끼 기준, 한 끼 권장량
              </p>
            </div>
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
                <div className={`h-3 -mt-3 rounded-full ${getProgressColor(
                  nutritionProgress.current.protein,
                  nutritionProgress.goals.protein
                )} opacity-80`} style={{
                  width: `${Math.min(nutritionProgress.percentages.protein, 100)}%`
                }} />
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
                <div className={`h-3 -mt-3 rounded-full ${getProgressColor(
                  nutritionProgress.current.carbs,
                  nutritionProgress.goals.carbs
                )} opacity-80`} style={{
                  width: `${Math.min(nutritionProgress.percentages.carbs, 100)}%`
                }} />
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
                <div className={`h-3 -mt-3 rounded-full ${getProgressColor(
                  nutritionProgress.current.fat,
                  nutritionProgress.goals.fat
                )} opacity-80`} style={{
                  width: `${Math.min(nutritionProgress.percentages.fat, 100)}%`
                }} />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}