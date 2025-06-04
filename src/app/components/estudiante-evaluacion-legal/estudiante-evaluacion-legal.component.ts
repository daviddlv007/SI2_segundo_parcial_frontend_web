// src/app/components/estudiante-evaluacion-legal/estudiante-evaluacion-legal.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Librerías para exportación
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
  EstudianteEvaluacionLegal
} from '../../models/estudiante-evaluacion-legal/estudiante-evaluacion-legal.model';
import { EstudianteEvaluacionLegalService } from '../../services/estudiante-evaluacion-legal/estudiante-evaluacion-legal.service';

@Component({
  selector: 'app-estudiante-evaluacion-legal',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule    // para [routerLink]
  ],
  templateUrl: './estudiante-evaluacion-legal.component.html',
  styleUrls: ['./estudiante-evaluacion-legal.component.scss']
})
export class EstudianteEvaluacionLegalComponent implements OnInit {
  listaEvaluaciones: EstudianteEvaluacionLegal[] = [];

  // Parámetros extraídos de la URL
  gestion = '';
  cursoId = 0;
  profesorId = 0;
  materiaId = 0;

  constructor(
    private route: ActivatedRoute,
    private evalLegalService: EstudianteEvaluacionLegalService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.gestion = params['gestion_academica_trimestral'];
      this.cursoId = +params['curso_id'];
      this.profesorId = +params['profesor_id'];
      this.materiaId = +params['materia_id'];
      this.cargarEvaluaciones();
    });
  }

  cargarEvaluaciones(): void {
    this.evalLegalService.getEvaluaciones({
      gestion_academica_trimestral: this.gestion,
      curso_id: this.cursoId,
      profesor_id: this.profesorId,
      materia_id: this.materiaId
    }).subscribe({
      next: (data: EstudianteEvaluacionLegal[] | null) => {
        const arr = data || [];
        // Ordenar alfabéticamente por nombre del estudiante
        this.listaEvaluaciones = arr.sort((a, b) =>
          a.estudiante.nombre.localeCompare(b.estudiante.nombre)
        );
      },
      error: err => {
        console.error('Error al cargar evaluaciones legales:', err);
        this.listaEvaluaciones = [];
      }
    });
  }

  /**
   * Exporta la tabla a un archivo .html
   */
  exportarHTML(): void {
    const tabla = document.getElementById('tablaEvaluaciones');
    if (!tabla) return;

    const htmlContent = tabla.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluaciones_${this.gestion}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta la tabla a un archivo .xlsx (Excel)
   */
  exportarExcel(): void {
    const datosParaExcel = this.listaEvaluaciones.map((item, index) => ({
      '#': index + 1,
      Estudiante: item.estudiante.nombre,
      'Saber (Prof.)': item.evaluacion_legal?.nota_saber_evaluacion_profesor ?? '-',
      'Hacer (Prof.)': item.evaluacion_legal?.nota_hacer_evaluacion_profesor ?? '-',
      'Ser (Prof.)': item.evaluacion_legal?.nota_ser_evaluacion_profesor ?? '-',
      'Decidir (Prof.)': item.evaluacion_legal?.nota_decidir_evaluacion_profesor ?? '-',
      'Saber (Estu.)': item.evaluacion_legal?.nota_ser_evaluacion_estudiante ?? '-',
      'Decidir (Estu.)': item.evaluacion_legal?.nota_decidir_evaluacion_estudiante ?? '-',
      'Nota Legal': item.evaluacion_legal?.nota_evaluacion_legal ?? '-'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `evaluaciones_${this.gestion}.xlsx`);
  }

  /**
   * Exporta la tabla a PDF usando html2canvas + jsPDF
   */
  exportarPDF(): void {
    const tabla = document.getElementById('tablaEvaluaciones');
    if (!tabla) return;

    html2canvas(tabla).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Añadimos la imagen al PDF, con margen superior de 10 mm
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`evaluaciones_${this.gestion}.pdf`);
    });
  }
}
