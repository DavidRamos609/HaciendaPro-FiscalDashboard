/**
 * Hacienda Pro - InvoiceManager
 * Gestiona el listado y carga de facturas emitidas y recibidas.
 */

class InvoiceManager {
    constructor() {
        this.invoices = JSON.parse(localStorage.getItem('hpro_invoices')) || [];
    }

    addInvoice(invoice) {
        // Validaciones básicas
        if (!invoice.concept || !invoice.base) return false;

        const newInvoice = {
            id: Date.now(),
            date: invoice.date || new Date().toISOString().split('T')[0],
            concept: invoice.concept,
            base: parseFloat(invoice.base),
            ivaRate: invoice.ivaRate || 0.21,
            type: invoice.type || 'out', // 'out' (ingreso), 'in' (gasto)
            category: invoice.category || 'general' // 'general', 'rent', 'professional', 'payroll'
        };

        this.invoices.push(newInvoice);
        this.save();
        return newInvoice;
    }

    getInvoicesByType(type) {
        return this.invoices.filter(inv => inv.type === type);
    }

    getInvoicesByCategory(category) {
        return this.invoices.filter(inv => inv.category === category);
    }

    deleteInvoice(id) {
        this.invoices = this.invoices.filter(inv => inv.id !== id);
        this.save();
    }

    save() {
        localStorage.setItem('hpro_invoices', JSON.stringify(this.invoices));
    }

    renderList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.invoices.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No hay facturas registradas.</p>';
            return;
        }

        container.innerHTML = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="text-align: left; color: var(--text-muted); border-bottom: 1px solid var(--border);">
            <th style="padding: 12px;">Fecha</th>
            <th style="padding: 12px;">Concepto</th>
            <th style="padding: 12px;">Tipo</th>
            <th style="padding: 12px; text-align: right;">Base</th>
            <th style="padding: 12px; text-align: right;">IVA</th>
          </tr>
        </thead>
        <tbody>
          ${this.invoices.map(inv => `
            <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
              <td style="padding: 12px;">${inv.date}</td>
              <td style="padding: 12px; font-weight: 600;">${inv.concept}</td>
              <td style="padding: 12px;"><span class="tax-badge ${inv.type === 'out' ? 'done' : 'pending'}">${inv.type === 'out' ? 'Ingreso' : 'Gasto'}</span></td>
              <td style="padding: 12px; text-align: right;">${inv.base.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
              <td style="padding: 12px; text-align: right;">${(inv.base * inv.ivaRate).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    }
}

export default new InvoiceManager();
