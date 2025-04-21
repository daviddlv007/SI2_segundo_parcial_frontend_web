import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VentaService } from '../../services/venta/venta.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ReportHelperService } from '../../services/reporte/report-helper.service';
import { CarritoDetalleService } from '../../services/carrito-detalle/carrito-detalle.service';
import { ProductoService } from '../../services/producto/producto.service';

import { Venta } from '../../models/venta/venta.model';
import { Usuario } from '../../models/usuario/usuario.model';
import { CarritoDetalle } from '../../models/carrito-detalle/carrito-detalle.model';
import { Producto } from '../../models/producto/producto.model';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  usuarios: Usuario[] = [];
  productos: Producto[] = [];
  
  usuarioMap: Record<number, string> = {};
  productoMap: Record<number, string> = {};
  detallesPorCarrito: Record<number, CarritoDetalle[]> = {};
  
  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  usuarioId: number | null = null;
  cargando = false;
  errorCarga: string | null = null;

  // Detalles modal
  detallesActuales: CarritoDetalle[] = [];
  mostrarDetalles = false;
  ventaSeleccionada: Venta | null = null;

  constructor(
    private ventaService: VentaService,
    private usuarioService: UsuarioService,
    private carritoDetalleService: CarritoDetalleService,
    private productoService: ProductoService,
    private reportHelper: ReportHelperService
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.cargando = true;
    this.errorCarga = null;
    
    forkJoin({
      usuarios: this.usuarioService.obtenerUsuarios(),
      ventas: this.ventaService.obtenerVentas(),
      detalles: this.carritoDetalleService.obtenerTodosDetalles(),
      productos: this.productoService.obtenerProductos()
    }).pipe(
      finalize(() => this.cargando = false)
    ).subscribe({
      next: ({ usuarios, ventas, detalles, productos }) => {
        this.usuarios = usuarios;
        this.productos = productos;
        
        // Crear mapeos
        usuarios.forEach(u => this.usuarioMap[u.id!] = u.nombre);
        productos.forEach(p => this.productoMap[p.id!] = p.nombre);
        
        // Procesar detalles
        this.procesarDetalles(detalles);
        
        // Asignar ventas con nombres de usuario
        this.ventas = ventas.map(v => ({
          ...v,
          usuarioNombre: this.usuarioMap[v.usuario] || 'Desconocido'
        }));
        
        this.ventasFiltradas = [...this.ventas];
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.errorCarga = 'Error al cargar los datos. Intente nuevamente.';
      }
    });
  }

  private procesarDetalles(detalles: CarritoDetalle[]): void {
    this.detallesPorCarrito = {};
    
    detalles.forEach(d => {
      if (!this.detallesPorCarrito[d.carrito]) {
        this.detallesPorCarrito[d.carrito] = [];
      }
      
      this.detallesPorCarrito[d.carrito].push({
        ...d,
        productoNombre: this.productoMap[d.producto] || 'Producto desconocido'
      });
    });
  }

  obtenerDetallesVenta(carritoId: number): CarritoDetalle[] {
    return this.detallesPorCarrito[carritoId] || [];
  }

  aplicarFiltros(): void {
    this.cargando = true;
    
    try {
      // Convertir usuarioId a number si no es null/undefined
      const usuarioId = this.usuarioId !== null && this.usuarioId !== undefined 
        ? Number(this.usuarioId) 
        : null;

      // Filtramos primero por usuario
      let resultado = this.reportHelper.filterSalesByUser(
        [...this.ventas], 
        usuarioId
      );

      // Luego por fechas si están definidas
      if (this.fechaInicio && this.fechaFin) {
        resultado = this.reportHelper.filterSalesByDateRange(
          resultado,
          this.fechaInicio,
          this.fechaFin
        );
      }

      this.ventasFiltradas = resultado;
    } catch (error) {
      console.error('Error al filtrar:', error);
      this.ventasFiltradas = [];
    } finally {
      this.cargando = false;
    }
  }

  limpiarFiltros(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.usuarioId = null;
    this.ventasFiltradas = [...this.ventas];
  }

  verDetallesVenta(venta: Venta): void {
    this.ventaSeleccionada = venta;
    this.detallesActuales = this.obtenerDetallesVenta(venta.carrito);
    this.mostrarDetalles = true;
  }

  exportarAPDF(): void {
    const data = this.reportHelper.prepareDataForExport(this.ventasFiltradas, this.usuarioMap);
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    let yPos = 30;
    
    if (this.fechaInicio || this.fechaFin) {
      const textoFechas = `Fechas: ${this.fechaInicio ? this.reportHelper.formatDateForDisplay(new Date(this.fechaInicio)) : 'N/A'} - ${this.fechaFin ? this.reportHelper.formatDateForDisplay(new Date(this.fechaFin)) : 'N/A'}`;
      doc.text(textoFechas, 14, yPos);
      yPos += 10;
    }
    
    if (this.usuarioId) {
      doc.text(`Usuario: ${this.usuarioMap[this.usuarioId] || 'Desconocido'}`, 14, yPos);
      yPos += 10;
    }
    
    yPos += 10;
    
    const headers = [['ID', 'Fecha', 'Usuario', 'Total', 'Método Pago', 'Carrito ID']];
    const rows = data.map(item => [
      item.ID,
      item.Fecha,
      item.Usuario,
      `$${item.Total}`,
      item['Método de Pago'],
      item['Carrito ID']
    ]);
    
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { top: yPos + 10 }
    });
    
    doc.save(`reporte_ventas_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  exportarDetallesAPDF(venta: Venta): void {
    const detalles = this.obtenerDetallesVenta(venta.carrito);
    const data = this.reportHelper.prepareDetailedExport(venta, detalles);
    
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Detalles de Venta #${venta.id}`, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    let yPos = 40;
    
    Object.entries(data.venta).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 20, yPos);
      yPos += 10;
    });
    
    yPos += 15;
    
    const headers = [['Producto', 'Cantidad', 'P. Unitario', 'Subtotal']];
    const rows = data.detalles.map((d: any) => [
        d.Producto,
        Number(d.Cantidad), // Asegúrate de que 'Cantidad' sea un número
        `$${parseFloat(d['Precio Unitario']).toFixed(2)}`, // Convierte a número y luego formatea
        `$${parseFloat(d.Subtotal).toFixed(2)}` // Convierte a número y luego formatea
      ]);
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
    
    doc.save(`detalles_venta_${venta.id}.pdf`);
  }

  exportarAExcel(): void {
    const data = this.reportHelper.prepareDataForExport(this.ventasFiltradas, this.usuarioMap);
    
    const dataFormatted = data.map(item => ({
      ...item,
      Total: `$${parseFloat(item.Total).toFixed(2)}`
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataFormatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Ventas');
    
    if (worksheet['!cols'] === undefined) worksheet['!cols'] = [];
    worksheet['!cols'][3] = { width: 15 };
    
    XLSX.writeFile(workbook, `reporte_ventas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  get totalRegistros(): number {
    return this.ventasFiltradas.length;
  }

  exportarDetallesAExcel(venta: Venta): void {
    const detalles = this.obtenerDetallesVenta(venta.carrito);
    const data = this.reportHelper.prepareDetailedExport(venta, detalles);
  
    // Mapeo para exportar los detalles con las propiedades correctas
    const detallesExportados = data.detalles.map((d: any) => ({
      Producto: d.productoNombre,               // Propiedad del modelo CarritoDetalle
      Cantidad: d.cantidad,                     // Propiedad del modelo CarritoDetalle
      'Precio Unitario': `$${parseFloat(d.precio_unitario).toFixed(2)}`, // Usamos 'precio_unitario' del modelo
      Subtotal: `$${(d.cantidad * d.precio_unitario).toFixed(2)}`
  // Calculamos el subtotal
    }));
  
    // Crear hoja para la información de la venta
    const ventaSheet = XLSX.utils.json_to_sheet([{
      'ID Venta': data.venta['ID Venta'],
      'Fecha': data.venta['Fecha'],
      'Usuario': data.venta['Usuario'],
      'Total': data.venta['Total Formateado'],
      'Método de Pago': data.venta['Método de Pago'],
      'Carrito ID': data.venta['Carrito ID']
    }]);
  
    // Crear hoja para los detalles exportados
    const detallesSheet = XLSX.utils.json_to_sheet(detallesExportados);
  
    // Crear libro Excel
    const workbook = XLSX.utils.book_new();
  
    // Añadir hojas al libro
    XLSX.utils.book_append_sheet(workbook, ventaSheet, 'Información Venta');
    XLSX.utils.book_append_sheet(workbook, detallesSheet, 'Detalles Carrito');
  
    // Ajustar anchos de columnas para la hoja de detalles
    detallesSheet['!cols'] = [
      { wch: 30 }, // Producto
      { wch: 10 }, // Cantidad
      { wch: 15 }, // Precio Unitario
      { wch: 15 }  // Subtotal
    ];
  
    // Exportar archivo
    XLSX.writeFile(workbook, `detalles_venta_${venta.id}.xlsx`);
  }
  
  

}