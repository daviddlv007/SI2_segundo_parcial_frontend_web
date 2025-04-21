import { Injectable } from '@angular/core';
import { Venta } from '../../models/venta/venta.model';
import { CarritoDetalle } from '../../models/carrito-detalle/carrito-detalle.model';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class ReportHelperService {
  constructor() {}

  private normalizeDate(date: Date | string | null | undefined): Date {
    if (!date) return new Date();
    
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
      return isValid(parsedDate) ? parsedDate : new Date();
    } catch {
      return new Date();
    }
  }

  filterSalesByDateRange(sales: Venta[], startDate: Date | string | null, endDate: Date | string | null): Venta[] {
    if (!startDate || !endDate) return [...sales];
    
    const start = startOfDay(this.normalizeDate(startDate));
    const end = endOfDay(this.normalizeDate(endDate));
    
    if (start > end) {
      console.warn('Fecha de inicio mayor que fecha final');
      return [];
    }
    
    return sales.filter(venta => {
      if (!venta.fecha) return false;
      const saleDate = this.normalizeDate(venta.fecha);
      return isWithinInterval(saleDate, { start, end });
    });
  }

  filterSalesByUser(sales: Venta[], userId: number | null | undefined): Venta[] {
    if (userId === null || userId === undefined || isNaN(userId)) {
      return [...sales];
    }
    return sales.filter(venta => Number(venta.usuario) === Number(userId));
  }

  formatDateForDisplay(date: Date | string | null | undefined): string {
    const normalized = this.normalizeDate(date);
    return format(normalized, 'dd/MM/yyyy HH:mm', { locale: es });
  }

  prepareDataForExport(sales: Venta[], userMap: Record<number, string>): any[] {
    return sales.map(venta => ({
      'ID': venta.id,
      'Fecha': venta.fecha ? this.formatDateForDisplay(venta.fecha) : 'Sin fecha',
      'Usuario': userMap[venta.usuario] || 'Desconocido',
      'Total': venta.total,
      'Método de Pago': venta.metodo_pago,
      'Carrito ID': venta.carrito
    }));
  }

  // Versión corregida en report-helper.service.ts
prepareDetailedExport(venta: Venta, detalles: CarritoDetalle[]): any {
  // Datos numéricos sin formato para cálculos
  const detallesNumericos = detalles.map(d => ({
    productoNombre: d.productoNombre,
    cantidad: d.cantidad,
    precioUnitarioNum: parseFloat(d.precio_unitario),
    subtotalNum: d.cantidad * parseFloat(d.precio_unitario)
  }));

  const ventaData = {
    'ID Venta': venta.id,
    'Fecha': this.formatDateForDisplay(venta.fecha),
    'Usuario': venta['usuarioNombre'] || 'Desconocido',
    'Total': venta.total, // Mantenemos el valor original
    'Total Formateado': `$${parseFloat(venta.total).toFixed(2)}`,
    'Método de Pago': venta.metodo_pago,
    'Carrito ID': venta.carrito
  };

  const detallesData = detallesNumericos.map(d => ({
    'Producto': d.productoNombre,
    'Cantidad': d.cantidad,
    'Precio Unitario': d.precioUnitarioNum, // Valor numérico
    'Precio Unitario Formateado': `$${d.precioUnitarioNum.toFixed(2)}`,
    'Subtotal': d.subtotalNum, // Valor numérico
    'Subtotal Formateado': `$${d.subtotalNum.toFixed(2)}`
  }));

  return {
    venta: ventaData,
    detalles: detallesData,
    // Versión combinada para exportación
    combined: [
      { 
        'Tipo': 'Información de Venta', 
        ...ventaData,
        'Total': `$${parseFloat(venta.total).toFixed(2)}` 
      },
      ...detallesNumericos.map(d => ({ 
        'Tipo': 'Detalle de Producto',
        'Producto': d.productoNombre,
        'Cantidad': d.cantidad,
        'Precio Unitario': `$${d.precioUnitarioNum.toFixed(2)}`,
        'Subtotal': `$${d.subtotalNum.toFixed(2)}`
      }))
    ]
  };
}
}