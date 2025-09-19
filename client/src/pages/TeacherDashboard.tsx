import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameButton } from "@/components/ui/game-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  FileText, 
  BookOpen, 
  LogOut,
  Download,
  Upload,
  Eye,
  BarChart3
} from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherName] = useState("Prof. Ana Martínez");
  const [newClassCode, setNewClassCode] = useState("");

  const classes = [
    {
      id: 1,
      name: "Grado 1A - Mañana",
      code: "EK1A2024",
      students: 24,
      avgProgress: 68,
    },
    {
      id: 2,
      name: "Grado 1B - Tarde", 
      code: "EK1B2024",
      students: 22,
      avgProgress: 45,
    },
    {
      id: 3,
      name: "Grado 2A - Mañana",
      code: "EK2A2024", 
      students: 26,
      avgProgress: 82,
    },
  ];

  const recentStudents = [
    { name: "María González", class: "1A", progress: 85, lastActive: "Hace 1 hora" },
    { name: "Carlos Ruiz", class: "1B", progress: 42, lastActive: "Hace 3 horas" },
    { name: "Sofía Morales", class: "2A", progress: 95, lastActive: "Hace 30 min" },
    { name: "Diego López", class: "1A", progress: 35, lastActive: "Hace 2 días" },
    { name: "Isabella Cruz", class: "1B", progress: 78, lastActive: "Hace 45 min" },
  ];

  const handleCreateClass = () => {
    if (newClassCode.trim()) {
      // Simulate creating new class
      setNewClassCode("");
    }
  };

  const handleUploadStudents = () => {
    navigate("/upload-students");
  };

  const handleViewClass = (classId: number) => {
    navigate(`/class/${classId}`);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-secondary-light/20 to-purple-light/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">English Kids - Docente</h1>
                <p className="text-muted-foreground">Bienvenida, {teacherName} 👩‍🏫</p>
              </div>
            </div>
            <GameButton variant="locked" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </GameButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Acciones Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Código de nueva clase (ej: EK3A2024)"
                      value={newClassCode}
                      onChange={(e) => setNewClassCode(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <GameButton variant="primary" onClick={handleCreateClass}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Clase
                  </GameButton>
                </div>
                <GameButton 
                  variant="orange" 
                  onClick={handleUploadStudents}
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Estudiantes por Archivo
                </GameButton>
              </CardContent>
            </Card>

            {/* Classes Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Mis Clases</h2>
                <Badge variant="secondary" className="text-sm">
                  {classes.length} clases activas
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.map((classItem) => (
                  <Card key={classItem.id} className="bg-white/80 backdrop-blur border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {classItem.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Código: {classItem.code}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Estudiantes</span>
                          <span className="font-semibold">{classItem.students}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Progreso Promedio</span>
                            <span className="font-semibold">{classItem.avgProgress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-secondary h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${classItem.avgProgress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <GameButton 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleViewClass(classItem.id)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </GameButton>
                          <GameButton variant="accent" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Reporte
                          </GameButton>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Statistics */}
            <Card className="bg-gradient-to-br from-success to-secondary text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Estadísticas</h3>
                    <p className="opacity-90 text-sm">Esta semana</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-90">Total estudiantes</span>
                    <span className="font-bold">72</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Activos hoy</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Módulos completados</span>
                    <span className="font-bold">134</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Clase {student.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{student.progress}%</p>
                      <p className="text-xs text-muted-foreground">{student.lastActive}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;