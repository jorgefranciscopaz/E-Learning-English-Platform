import * as React from "react";
import { cn } from "@/lib/utils";
import { Lock, Check } from "lucide-react";

interface ModuleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon: React.ReactNode;
  isLocked?: boolean;
  isCompleted?: boolean;
  progress?: number;
  variant?: "primary" | "secondary" | "accent" | "orange" | "purple";
}

const ModuleCard = React.forwardRef<HTMLDivElement, ModuleCardProps>(
  ({ className, title, icon, isLocked = false, isCompleted = false, progress, variant = "primary", onClick, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-gradient-to-br from-primary to-primary-light",
      secondary: "bg-gradient-to-br from-secondary to-secondary-light", 
      accent: "bg-gradient-to-br from-accent to-accent-light",
      orange: "bg-gradient-to-br from-orange to-orange-light",
      purple: "bg-gradient-to-br from-purple to-purple-light",
    };

    return (
      <div 
        className={cn(
          "module-card relative text-white overflow-hidden",
          variantClasses[variant],
          isLocked && "opacity-75",
          className
        )}
        onClick={!isLocked ? onClick : undefined}
        ref={ref}
        {...props}
      >
        {/* Main content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">{icon}</div>
            {isCompleted && (
              <div className="bg-white/20 rounded-full p-2">
                <Check className="h-6 w-6" />
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          
          {progress !== undefined && (
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
          
          {!isLocked && !isCompleted && (
            <p className="text-sm opacity-90">¡Toca para empezar!</p>
          )}
          
          {isCompleted && (
            <p className="text-sm opacity-90">¡Completado! ⭐</p>
          )}
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div className="locked-overlay">
            <div className="bg-white/20 rounded-full p-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  }
);
ModuleCard.displayName = "ModuleCard";

export { ModuleCard };