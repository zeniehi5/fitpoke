import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const goalOptions = [
  { label: "린 메스업", value: "lean-massup" },
  { label: "벌크업", value: "bulkup" },
  { label: "체중 감량", value: "fat-loss" },
] as const;

const FormSchema = z.object({
  age: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().refine((val) => !isNaN(val), {
      message: "나이를 입력해주세요",
    })
  ),

  gender: z.string().min(1, "성별을 선택해주세요"),

  height: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().refine((val) => !isNaN(val), {
      message: "키를 입력해주세요",
    })
  ),

  weight: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z.number().refine((val) => !isNaN(val), {
      message: "몸무게를 입력해주세요",
    })
  ),

  goal: z.string().min(1, "식단 목표를 선택해주세요"),
});

export default function InputForm() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast("입력한 정보", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    navigate("/result", { state: data });
  };

  return (
    <Card className="w-full min-h-screen p-0 border-none rounded-none">
      <div className="w-full min-h-screen">
        {/* background image */}
        <img
          src="https://cdn.imweb.me/thumbnail/20250706/a351a07bd7e7b.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 z-10 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white/70 backdrop-blur-md rounded-md p-8 w-full max-w-md mx-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* 성별 */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="px-2">성별</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <div className="w-1/2">
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full !bg-white !text-black hover:!bg-[#d8de69] focus-visible:outline-none focus-visible:ring-0 rounded-full shadow-lg transition-colors duration-300 text-base",
                                {
                                  "!bg-[#d8de69] !text-black !border-[#90c53f]":
                                    field.value === "male",
                                }
                              )}
                              onClick={() => field.onChange("male")}
                            >
                              남성
                            </Button>
                          </div>
                          <div className="w-1/2">
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full !bg-white !text-black hover:!bg-[#d8de69] focus-visible:outline-none focus-visible:ring-0 rounded-full shadow-lg transition-colors duration-300 text-base",
                                {
                                  "!bg-[#d8de69] !text-black !border-[#90c53f]":
                                    field.value === "female",
                                }
                              )}
                              onClick={() => field.onChange("female")}
                            >
                              여성
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 나이 */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="px-2">나이</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="예: 28"
                          {...field}
                          className="bg-white"
                          value={(field.value as number) ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 키, 몸무게 */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="px-2">키 (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="예: 165"
                            className="bg-white"
                            {...field}
                            value={(field.value as number) ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel className="px-2">몸무게 (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="예: 55"
                            className="bg-white"
                            {...field}
                            value={(field.value as number) ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 목표 */}
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="px-2">다이어트 목적</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-between !bg-white !text-black focus-visible:outline-none focus-visible:ring-0 rounded-full shadow-lg transition-colors duration-300 text-base",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? goalOptions.find(
                                    (g) => g.value === field.value
                                  )?.label
                                : "목표 선택"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="목표 검색..." />
                            <CommandList>
                              <CommandEmpty>결과 없음</CommandEmpty>
                              <CommandGroup>
                                {goalOptions.map((g) => (
                                  <CommandItem
                                    key={g.value}
                                    value={g.label}
                                    onSelect={() =>
                                      form.setValue("goal", g.value)
                                    }
                                  >
                                    {g.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value === g.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* submit */}
                <Button
                  type="submit"
                  className="w-full !bg-white !text-black hover:!bg-[#d8de69] focus-visible:outline-none focus-visible:ring-0 rounded-full shadow-lg transition-colors duration-300 text-base"
                >
                  딱 맞는 메뉴를 바로 확인해봐요 🍽️
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Card>
  );
}
