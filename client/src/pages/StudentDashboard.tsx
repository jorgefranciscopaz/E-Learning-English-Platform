import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModuleCard } from "@/components/ui/module-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { GameButton } from "@/components/ui/game-button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  LogOut, 
  Trophy, 
  Star,
  BookOpen,
  Hash,
  Heart,
  Palette,
  Calendar,
  Dog,
  Home
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentName] = useState("María González");
  const [completedModules] = useState(3);
  const totalModules = 7;
  const overallProgress = (completedModules / totalModules) * 100;

  const modules = [
    {
      id: 1,
      title: "Abecedario",
      icon: "🔤",
      variant: "primary" as const,
      isCompleted: true,
      progress: 100,
    },
    {
      id: 2,
      title: "Números",
      icon: "🔢",
      variant: "secondary" as const,
      isCompleted: true,
      progress: 100,
    },
    {
      id: 3,
      title: "Vocales",
      icon: "🎵",
      variant: "accent" as const,
      isCompleted: true,
      progress: 100,
    },
    {
      id: 4,
      title: "Colores",
      icon: "🎨",
      variant: "orange" as const,
      isCompleted: false,
      progress: 60,
      isLocked: false,
    },
    {
      id: 5,
      title: "Días",
      icon: "📅",
      variant: "purple" as const,
      isCompleted: false,
      progress: 0,
      isLocked: true,
    },
    {
      id: 6,
      title: "Animales",
      icon: "🐶",
      variant: "secondary" as const,
      isCompleted: false,
      progress: 0,
      isLocked: true,
    },
    {
      id: 7,
      title: "Familia",
      icon: "👨‍👩‍👧‍👦",
      variant: "primary" as const,
      isCompleted: false,
      progress: 0,
      isLocked: true,
    },
  ];

  const handleModuleClick = (moduleId: number, isLocked: boolean) => {
    if (!isLocked) {
      navigate(`/module/${moduleId}`);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-accent-light/20 to-purple-light/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">English Kids</h1>
                <p className="text-muted-foreground">¡Hola, {studentName}! 👋</p>
              </div>
            </div>
            <GameButton variant="locked" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </GameButton>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-3xl flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Tu Progreso</h2>
                  <p className="text-muted-foreground">
                    Has completado {completedModules} de {totalModules} módulos
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round(overallProgress)}%
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(completedModules)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                  {[...Array(totalModules - completedModules)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-muted" />
                  ))}
                </div>
              </div>
            </div>
            <ProgressBar value={overallProgress} showLabel={false} variant="success" />
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              icon={<span className="text-4xl">{module.icon}</span>}
              isLocked={module.isLocked}
              isCompleted={module.isCompleted}
              progress={module.progress}
              variant={module.variant}
              onClick={() => handleModuleClick(module.id, module.isLocked || false)}
              className="h-48"
            />
          ))}
        </div>

        {/* Achievement Section */}
        <Card className="mt-8 bg-gradient-to-r from-success to-secondary text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">¡Sigue así! 🎉</h3>
                <p className="opacity-90">
                  Has ganado {completedModules * 10} puntos. ¡Completa el siguiente módulo para ganar más!
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{completedModules * 10} pts</div>
                <div className="text-sm opacity-80">Puntos totales</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;