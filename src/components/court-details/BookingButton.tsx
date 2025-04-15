
import { Button } from "@/components/ui/button";

interface BookingButtonProps {
  onBookNow: () => void;
  isDisabled: boolean;
}

export const BookingButton = ({ onBookNow, isDisabled }: BookingButtonProps) => {
  return (
    <Button
      onClick={onBookNow}
      className="w-full py-6 text-lg bg-green-500 hover:bg-green-600"
      disabled={isDisabled}
    >
      Book Now
    </Button>
  );
};
