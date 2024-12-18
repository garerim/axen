import mayorImage from "@/assets/werewolf/role/insigne.png";

interface MayorBadgeProps {
  className?: string;
}

export const MayorBadge = ({ className = "" }: MayorBadgeProps) => (
  <div className={`absolute top-2 right-2 w-12 h-12 ${className}`}>
    <img
      src={mayorImage}
      alt="Mayor Badge"
    />
  </div>
);