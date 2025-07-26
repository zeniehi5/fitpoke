import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <Card className="w-full min-h-screen p-0 border-none rounded-none">
      <div className="w-full min-h-screen">
        {/* background image */}
        <img
          src="https://cdn.imweb.me/thumbnail/20250706/a351a07bd7e7b.jpg"
          alt="Main visual"
          className="w-full h-full object-cover absolute inset-0"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center space-y-8 w-full max-w-sm mx-auto">
            {/* logo box */}
            <div className="w-[260px] h-[260px] bg-white/90 shadow-xl flex items-center justify-center">
              <img
                src="https://cdn.imweb.me/thumbnail/20250712/2525dbb64c007.png"
                alt="Logo"
                className="w-[220px] h-[220px] object-contain"
              />
            </div>

            {/* button */}
            <Button
              variant="default"
              onClick={() => navigate("/form")}
              className="w-[260px] h-10 mt-2 py-3 px-6 !bg-white !text-black hover:!bg-[#d8de69] focus-visible:outline-none focus-visible:ring-0 rounded-full shadow-lg transition-colors duration-300 text-base"
            >
              당신만을 위한 메뉴를 골라드릴게요 🍀
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
