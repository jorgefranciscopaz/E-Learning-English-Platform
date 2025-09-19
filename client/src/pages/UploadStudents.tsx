import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameButton } from "@/components/ui/game-button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, FileText, Users, CheckCircle, AlertCircle } from "lucide-react";

const UploadStudents = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [students, setStudents] = useState<Array<{
    name: string;
    email: string;
    grade: string;
    status: "valid" | "error";
    error?: string;
  }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  // Simulated student data for preview
  const sampleStudents = [
    { name: "María González", email: "maria.gonzalez@email.com", grade: "1A", status: "valid" as const },
    { name: "Carlos Ruiz", email: "carlos.ruiz@email.com", grade: "1A", status: "valid" as const },
    { name: "Sofía Morales", email: "sofia.morales@email.com", grade: "1A", status: "valid" as const },
    { name: "Diego López", email: "diego.lopez@email.com", grade: "1A", status: "valid" as const },
    { name: "Isabella Cruz", email: "isabella.cruz", grade: "1A", status: "error" as const, error: "Email inválido" },
    { name: "Ana Rodríguez", email: "ana.rodriguez@email.com", grade: "1A", status: "valid" as const },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.type === "application/vnd.ms-excel" || file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        // Simulate file processing
        setTimeout(() => {
          setStudents(sampleStudents);
        }, 1000);
      } else {
        alert("Por favor selecciona un archivo CSV o Excel (.xlsx)");
      }
    }
  };

  const handleUpload = () => {
    setIsProcessing(true);
    // Simulate upload process
    setTimeout(() => {
      setIsProcessing(false);
      setUploadCompleted(true);
    }, 2000);
  };

  const handleBack = () => {
    navigate("/teacher-dashboard");
  };

  const validStudents = students.filter(s => s.status === "valid");
  const errorStudents = students.filter(s => s.status === "error");

  if (uploadCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-light/20 via-secondary-light/20 to-primary-light/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">¡Éxito! 🎉</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Se han cargado {validStudents.length} estudiantes correctamente
            </p>
            {errorStudents.length > 0 && (
              <p className="text-sm text-muted-foreground mb-6">
                {errorStudents.length} registros tuvieron errores y no se cargaron
              </p>
            )}
            <GameButton variant="primary" size="lg" onClick={handleBack}>
              Volver al Dashboard
            </GameButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light/20 via-accent-light/20 to-primary-light/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GameButton variant="locked" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </GameButton>
            <div>
              <h1 className="text-xl font-bold">Cargar Estudiantes por Archivo</h1>
              <p className="text-sm text-muted-foreground">
                Sube un archivo CSV o Excel con la información de tus estudiantes
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Upload Section */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Subir Archivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Format Requirements */}
            <div className="bg-accent/10 rounded-2xl p-6 border border-accent/20">
              <h4 className="font-bold text-accent-foreground mb-3">📋 Formato Requerido</h4>
              <p className="text-accent-foreground/80 mb-3">
                Tu archivo debe tener estas columnas (en este orden):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/50 rounded-lg p-3">
                  <strong>Columna A:</strong> Nombre Completo
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <strong>Columna B:</strong> Email
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <strong>Columna C:</strong> Grado (ej: 1A, 1B)
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <GameButton 
                    variant="accent" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Cambiar Archivo
                  </GameButton>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Selecciona tu archivo
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Formatos soportados: CSV, Excel (.xlsx, .xls)
                    </p>
                  </div>
                  <GameButton 
                    variant="primary" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar Archivo
                  </GameButton>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        {students.length > 0 && (
          <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Vista Previa de Estudiantes</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {validStudents.length} Válidos
                  </Badge>
                  {errorStudents.length > 0 && (
                    <Badge variant="destructive">
                      {errorStudents.length} Con errores
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estado</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Grado</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index} className={student.status === "error" ? "bg-destructive/5" : ""}>
                        <TableCell>
                          {student.status === "valid" ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>
                          {student.error ? (
                            <span className="text-sm text-destructive">{student.error}</span>
                          ) : (
                            <span className="text-sm text-success">Válido</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 text-center">
                <GameButton 
                  variant="success" 
                  size="lg"
                  onClick={handleUpload}
                  disabled={isProcessing || validStudents.length === 0}
                  className="min-w-48"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Confirmar y Subir ({validStudents.length} estudiantes)
                    </>
                  )}
                </GameButton>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadStudents;