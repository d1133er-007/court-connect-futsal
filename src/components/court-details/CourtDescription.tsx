
import { Court } from "@/types";
import { DollarSign } from "lucide-react";

interface CourtDescriptionProps {
  court: Court;
}

export const CourtDescription = ({ court }: CourtDescriptionProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">About this court</h2>
        <div className="text-xl text-green-500 font-bold flex items-center">
          <DollarSign className="w-5 h-5" />
          <span>Rs. {court.pricePerHour}</span>
          <span className="text-gray-600 text-sm ml-2">per hour</span>
        </div>
      </div>
      <p className="text-gray-700">{court.description}</p>
    </>
  );
};
