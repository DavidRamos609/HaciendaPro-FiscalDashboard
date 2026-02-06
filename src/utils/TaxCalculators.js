/**
 * Hacienda Pro - Lógica Fiscal 2026
 * Adaptado a la normativa vigente para SL en España
 */

const FISCAL_YEAR = 2026;

const RATES_2026 = {
  IVA: 0.21,
  RETENCION_ALQUILER: 0.19, // Modelo 115
  RETENCION_PROFESIONALES: 0.15, // Modelo 111 (estándar)
  MEI: 0.009, // Mecanismo de Equidad Intergeneracional 2026 (0.90%)
  IMPUESTO_SOCIEDADES: {
    GENERAL: 0.24,
    MICROPYME_TRAMO_1: 0.21, // < 50k base
    MICROPYME_TRAMO_2: 0.22, // > 50k base
    NUEVA_CREACION: 0.15
  }
};

/**
 * Calcula el Modelo 303 (IVA Trimestral)
 * Incluye lógica de Régimen de Franquicia de IVA (< 85.000€)
 */
export const calculateModelo303 = (invoicesOut, invoicesIn, applyFranchise = false) => {
  const annualRevenue = invoicesOut.reduce((acc, inv) => acc + inv.base, 0);

  // Si aplica franquicia y los ingresos son < 85k, el IVA es 0 (no repercute ni deduce)
  if (applyFranchise && annualRevenue < 85000) {
    return {
      totalPagar: 0,
      ivaRepercutido: 0,
      ivaSoportado: 0,
      franchiseApplied: true
    };
  }

  const ivaRepercutido = invoicesOut.reduce((acc, inv) => acc + (inv.base * (inv.ivaRate || RATES_2026.IVA)), 0);
  const ivaSoportado = invoicesIn.reduce((acc, inv) => acc + (inv.base * (inv.ivaRate || RATES_2026.IVA)), 0);

  return {
    totalPagar: ivaRepercutido - ivaSoportado,
    ivaRepercutido,
    ivaSoportado,
    franchiseApplied: false
  };
};

/**
 * Calcula el Modelo 115 (Retenciones Alquiler)
 * Solo aplica a facturas de alquiler recibidas (gastos)
 */
export const calculateModelo115 = (rentExpenses) => {
  const totalRetencion = rentExpenses.reduce((acc, exp) => acc + (exp.base * RATES_2026.RETENCION_ALQUILER), 0);

  return {
    totalPagar: totalRetencion,
    baseImponible: rentExpenses.reduce((acc, exp) => acc + exp.base, 0)
  };
};

/**
 * Calcula el Modelo 111 (Retenciones IRPF)
 */
export const calculateModelo111 = (payrollData, professionalInvoices) => {
  const retencionNominas = payrollData.reduce((acc, item) => acc + item.irpf, 0);
  const retencionProfesionales = professionalInvoices.reduce((acc, inv) => acc + (inv.base * (inv.retRate || RATES_2026.RETENCION_PROFESIONALES)), 0);

  return {
    totalPagar: retencionNominas + retencionProfesionales,
    numPerceptores: payrollData.length + professionalInvoices.length
  };
};

/**
 * Estimación del Modelo 200 (Impuesto sobre Sociedades)
 */
export const estimateModelo200 = (revenue, expenses, isMicropyme = true) => {
  const baseImponible = revenue - expenses;
  if (baseImponible <= 0) return { totalPagar: 0, baseImponible };

  let rate = RATES_2026.IMPUESTO_SOCIEDADES.GENERAL;

  if (isMicropyme) {
    rate = baseImponible < 50000
      ? RATES_2026.IMPUESTO_SOCIEDADES.MICROPYME_TRAMO_1
      : RATES_2026.IMPUESTO_SOCIEDADES.MICROPYME_TRAMO_2;
  }

  return {
    totalPagar: baseImponible * rate,
    baseImponible,
    rateApplied: rate
  };
};

/**
 * Calcula el MEI (Mecanismo de Equidad Intergeneracional)
 */
export const calculateMEI = (grossSalary) => {
  const totalMEI = grossSalary * RATES_2026.MEI;
  return {
    total: totalMEI,
    empresa: grossSalary * 0.0075,
    trabajador: grossSalary * 0.0015
  };
};
