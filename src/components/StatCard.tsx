import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accent?: boolean; // kept for prop compatibility but no longer changes default look
}

const StatCard = ({ title, value, change, changeType = "neutral", icon: Icon }: StatCardProps) => {
  return (
    <div className="group rounded-xl p-5 bg-card border border-border cursor-pointer
      transition-all duration-300
      hover:bg-primary hover:border-primary hover:text-primary-foreground hover:shadow-lg
      animate-fade-in"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground group-hover:text-primary-foreground/70 transition-colors duration-300">
            {title}
          </p>
          <p className="text-3xl font-heading font-bold mt-1">
            {value}
          </p>
          {change && (
            <p className={`text-xs mt-2 font-medium transition-colors duration-300
              group-hover:text-primary-foreground/80
              ${changeType === "up"   ? "text-green-600" :
                changeType === "down" ? "text-primary"   :
                "text-muted-foreground"}`}
            >
              {changeType === "up" ? "↑" : changeType === "down" ? "↓" : ""} {change}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-accent group-hover:bg-primary-foreground/15 transition-colors duration-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
