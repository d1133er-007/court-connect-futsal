
import { Court } from "@/types";
import { Award } from "lucide-react";

interface CourtFeaturesProps {
  court: Court;
}

export const CourtFeatures = ({ court }: CourtFeaturesProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Features</h2>
      <div className="grid grid-cols-2 gap-3">
        {court.features.map((feature, index) => (
          <div key={index} className="flex items-center text-gray-700">
            <Award className="w-5 h-5 text-green-500 mr-2" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
