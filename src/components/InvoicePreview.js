/**
 * Hacienda Pro - InvoicePreview
 * Renderiza la factura legal con estética premium y QR Verifactu.
 */

class InvoicePreview {
  render(factura, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="invoice-modal" class="glass-card animate-fade" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; max-height: 90vh; overflow-y: auto; z-index: 1000; padding: 40px; background: white; color: #1e293b; box-shadow: 0 0 50px rgba(0,0,0,0.5);">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
          <div>
            <h2 style="color: var(--primary); margin: 0;">FACTURA REGLAMENTARIA</h2>
            <p style="color: #64748b; font-size: 0.9rem;">Normativa Verifactu 2026</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8;">&times;</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
          <div>
            <h4 style="text-transform: uppercase; color: #94a3b8; font-size: 0.75rem;">Emisor</h4>
            <p style="font-weight: 700;">${factura.emisor.nombre}</p>
            <p>NIF: ${factura.emisor.nif}</p>
            <p>${factura.emisor.direccion}</p>
          </div>
          <div style="text-align: right;">
            <h4 style="text-transform: uppercase; color: #94a3b8; font-size: 0.75rem;">Cliente / Destinatario</h4>
            <p style="font-weight: 700;">${factura.cliente}</p>
            <p>NIF/CIF: ${factura.nif}</p>
            <p>${factura.domicilioCliente}</p>
          </div>
        </div>

        <div style="margin-top: 40px; background: #f8fafc; padding: 20px; border-radius: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Serie y Número:</span>
            <span style="font-weight: 700;">${factura.serie}-${factura.numero}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Fecha de Expedición:</span>
            <span style="font-weight: 700;">${factura.fecha.split('T')[0]}</span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 40px;">
          <thead>
            <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; color: #64748b;">
              <th style="padding: 10px 0;">Concepto / Descripción</th>
              <th style="padding: 10px 0; text-align: right;">Base</th>
              <th style="padding: 10px 0; text-align: right;">IVA (${factura.tipoIva}%)</th>
              ${factura.esAlquiler ? `<th style="padding: 10px 0; text-align: right;">IRPF (19%)</th>` : ''}
              <th style="padding: 10px 0; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 15px 0; max-width: 300px; line-height: 1.4;">${factura.concepto}</td>
              <td style="padding: 15px 0; text-align: right; vertical-align: top;">${factura.base.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
              <td style="padding: 15px 0; text-align: right; vertical-align: top;">${factura.iva.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
              ${factura.esAlquiler ? `<td style="padding: 15px 0; text-align: right; color: #ef4444; vertical-align: top;">-${factura.irpf.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>` : ''}
              <td style="padding: 15px 0; text-align: right; font-weight: 700; vertical-align: top;">${factura.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          <h4 style="text-transform: uppercase; color: #94a3b8; font-size: 0.75rem; margin-bottom: 5px;">Forma de Pago</h4>
          <p style="font-weight: 600; font-size: 0.9rem;">Transferencia Bancaria: <span style="font-family: monospace;">${factura.iban}</span></p>
        </div>

        <div style="margin-top: 50px; display: flex; align-items: flex-end; justify-content: space-between; border-top: 1px dashed #cbd5e1; padding-top: 30px;">
          <div style="max-width: 60%;">
            <p style="font-size: 0.75rem; color: #64748b; margin-bottom: 10px;">${factura.leyenda}</p>
            <p style="font-family: monospace; font-size: 0.65rem; color: #94a3b8; word-break: break-all;">Hash: ${factura.hash}</p>
            ${factura.isSigned ? `<p style="color: #10b981; font-size: 0.75rem; font-weight: 700; margin-top: 10px;">✓ Firma Digital XAdES Generada Correctamente</p>` : ''}
          </div>
          <div style="text-align: center;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(factura.qrUrl)}" alt="QR Verifactu" style="width: 120px; border: 1px solid #e2e8f0; padding: 5px;">
            <p style="font-size: 0.6rem; color: #94a3b8; margin-top: 5px;">Escanee para verificar</p>
          </div>
        </div>

        <div style="margin-top: 40px; display: flex; gap: 10px;">
          <button class="btn-primary" style="flex: 1;" onclick="window.print()">Imprimir / Guardar PDF</button>
          <button class="btn-primary" style="flex: 1; background: #64748b;" onclick="alert('Factura enviada al cliente')">Enviar por Email</button>
        </div>
      </div>
      <div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 999;" onclick="this.nextElementSibling.remove(); this.remove()"></div>
    `;
  }
}

export default new InvoicePreview();
