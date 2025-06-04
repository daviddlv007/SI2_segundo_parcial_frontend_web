// src/app/models/estudiante-evaluacion-legal/estudiante-evaluacion-legal.model.ts

export interface EstudianteBasico {
  id: number;
  nombre: string;
}

export interface EvaluacionLegal {
  id: number;
  nota_saber_evaluacion_profesor: string;    // p. ej. "35.00"
  nota_hacer_evaluacion_profesor: string;    // p. ej. "20.00"
  nota_ser_evaluacion_profesor: string;      // p. ej. "735.08"
  nota_decidir_evaluacion_profesor: string;  // p. ej. "94.00"
  nota_evaluacion_profesor: string;          // p. ej. "20.00"
  nota_ser_evaluacion_estudiante: string;    // p. ej. "53.00"
  nota_decidir_evaluacion_estudiante: string;// p. ej. "6.55"
  nota_evaluacion_estudiante: string;        // p. ej. "20.00"
  nota_evaluacion_legal: string;             // p. ej. "85.00"
  inscripcion_trimestre: number;             // p. ej. 3316
}

export interface EstudianteEvaluacionLegal {
  estudiante: EstudianteBasico;
  evaluacion_legal?: EvaluacionLegal;
}
