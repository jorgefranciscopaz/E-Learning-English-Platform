import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameButton } from "@/components/ui/game-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Volume2, CheckCircle } from "lucide-react";

const ModuleView = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const modules = {
    "1": { name: "Abecedario", icon: "🔤", color: "primary" },
    "2": { name: "Números", icon: "🔢", color: "secondary" },
    "3": { name: "Vocales", icon: "🎵", color: "accent" },
    "4": { name: "Colores", icon: "🎨", color: "orange" },
  };

  const currentModule = modules[moduleId as keyof typeof modules] || modules["4"];
  const totalLessons = 5;
  const lessonProgress = (currentLesson / totalLessons) * 100;

  const lessonContent = {
    4: {
      1: {
        title: "Colores Básicos",
        content: "Aprende los colores más importantes en inglés:",
        items: [
          { word: "Red", translation: "Rojo", color: "#ef4444" },
          { word: "Blue", translation: "Azul", color: "#3b82f6" },
          { word: "Green", translation: "Verde", color: "#22c55e" },
          { word: "Yellow", translation: "Amarillo", color: "#eab308" },
        ]
      }
    }
  };

  const quizQuestions = [
    {
      question: "¿Cómo se dice 'Rojo' en inglés?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: "Red"
    },
    {
      question: "¿Cuál es el color 'Blue'?",
      options: ["Rojo", "Azul", "Verde", "Amarillo"],
      correct: "Azul"
    },
    {
      question: "¿Cómo se dice 'Verde' en inglés?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: "Green"
    },
    {
      question: "¿Cuál es el color 'Yellow'?",
      options: ["Rojo", "Azul", "Verde", "Amarillo"],
      correct: "Amarillo"
    },
    {
      question: "¿Cómo se dice 'Azul' en inglés?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: "Blue"
    }
  ];

  const handleBack = () => {
    navigate("/student-dashboard");
  };

  const handleCompleteLesson = () => {
    if (currentLesson < totalLessons) {
      setCurrentLesson(prev => prev + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handleQuizAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      setQuizCompleted(true);
    }
  };

  const handleFinishModule = () => {
    navigate("/student-dashboard");
  };

  const playAudio = (word: string) => {
    // Simulate audio playback
    console.log(`Playing audio for: ${word}`);
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-light/20 via-accent-light/20 to-primary-light/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-10 w-10 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">¡Felicidades! 🎉</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Has completado el módulo de {currentModule.name}
            </p>
            <p className="text-2xl font-bold text-success mb-6">
              Puntuación: {score}/{quizQuestions.length}
            </p>
            <div className="flex space-x-2 justify-center mb-6">
              {[...Array(score)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-accent text-accent" />
              ))}
            </div>
            <GameButton variant="primary" size="lg" onClick={handleFinishModule}>
              Continuar Aprendiendo
            </GameButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warning-light/20 via-accent-light/20 to-primary-light/20">
        <header className="bg-white shadow-sm border-b-2 border-warning/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GameButton variant="locked" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </GameButton>
              <div>
                <h1 className="text-xl font-bold">Mini Test - {currentModule.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {quizQuestions.length}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-6">
          <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl">{quizQuestions[currentQuestion].question}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {currentQuestion + 1}/{quizQuestions.length}
                </div>
              </div>
              <ProgressBar value={((currentQuestion + 1) / quizQuestions.length) * 100} />
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-xl border-2 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option} id={`option-${index}`} className="scale-125" />
                    <Label htmlFor={`option-${index}`} className="text-lg font-medium cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <GameButton 
                variant="warning" 
                size="lg" 
                onClick={handleQuizAnswer}
                disabled={!selectedAnswer}
                className="w-full"
              >
                {currentQuestion < quizQuestions.length - 1 ? "Siguiente Pregunta" : "Finalizar Test"}
              </GameButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const lesson = lessonContent[4]?.[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light/20 via-accent-light/20 to-primary-light/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GameButton variant="locked" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </GameButton>
            <div>
              <h1 className="text-xl font-bold">{currentModule.name} {currentModule.icon}</h1>
              <p className="text-sm text-muted-foreground">
                Lección {currentLesson} de {totalLessons}
              </p>
            </div>
          </div>
          <ProgressBar value={lessonProgress} className="w-48" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Lesson Content */}
        <Card className="mb-8 bg-white/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center space-x-3">
              <span className="text-4xl">{currentModule.icon}</span>
              <span>{lesson?.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">{lesson?.content}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson?.items.map((item, index) => (
                <Card key={index} className="p-4 border-2 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-2xl"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="text-2xl font-bold">{item.word}</p>
                        <p className="text-lg text-muted-foreground">{item.translation}</p>
                      </div>
                    </div>
                    <GameButton 
                      variant="accent" 
                      size="sm"
                      onClick={() => playAudio(item.word)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </GameButton>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">💡</span>
                </div>
                <div>
                  <h4 className="font-bold text-accent-foreground mb-2">¡Consejo!</h4>
                  <p className="text-accent-foreground/80">
                    Practica diciendo cada color en voz alta. ¡La repetición te ayudará a recordarlos mejor!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Button */}
        <div className="text-center">
          <GameButton 
            variant="orange" 
            size="xl"
            onClick={handleCompleteLesson}
            className="min-w-64"
          >
            <CheckCircle className="h-6 w-6 mr-3" />
            {currentLesson < totalLessons ? "Completar Lección" : "Hacer Mini Test"}
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default ModuleView;