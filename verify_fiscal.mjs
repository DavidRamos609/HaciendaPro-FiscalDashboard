
// Mock de localStorage para Node.js
global.localStorage = {
    _data: {},
    setItem: function (id, val) { this._data[id] = String(val); },
    getItem: function (id) { return this._data[id] || null; }
};

// Mock de document para evitar errores en renderList si se importa
global.document = {
    getElementById: () => null
};

import InvoiceManager from './src/components/InvoiceManager.js';
import { calculateModelo303, calculateMEI } from './src/utils/TaxCalculators.js';

console.log('--- Probando Lógica Fiscal 2026 ---');

// 1. Probar MEI
const mei = calculateMEI(2000);
console.log('MEI para 2000€:', mei);
if (mei.total === 18) console.log('✅ MEI correcto (0.90%)');

// 2. Probar Franquicia IVA
const invoicesLow = [{ base: 1000, ivaRate: 0.21 }];
const m303 = calculateModelo303(invoicesLow, [], true);
console.log('Modelo 303 (Franquicia < 85k):', m303);
if (m303.totalPagar === 0 && m303.franchiseApplied) console.log('✅ Franquicia IVA aplicada correctamente');

// 3. Probar Hashing VeriFactu
console.log('\n--- Probando Hashing VeriFactu ---');
const inv1 = InvoiceManager.addInvoice({ concept: 'Venta 1', base: 100, type: 'out' });
const inv2 = InvoiceManager.addInvoice({ concept: 'Venta 2', base: 200, type: 'out' });

console.log('Factura 1 Hash:', inv1.hash);
console.log('Factura 2 lastHash:', inv2.lastHash);
console.log('Factura 2 Hash:', inv2.hash);

if (inv2.lastHash === inv1.hash && inv1.hash !== inv2.hash) {
    console.log('✅ Encadenamiento de hashes correcto (Trazabilidad VeriFactu)');
} else {
    console.log('❌ Error en el encadenamiento de hashes');
}
