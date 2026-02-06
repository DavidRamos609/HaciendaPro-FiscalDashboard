/**
 * Hacienda Pro - EmailService
 * Gestión de envío de facturas firmadas a clientes.
 */

class EmailService {
    async sendInvoice(invoice, email) {
        console.log(`Enviando factura ${invoice.serie}-${invoice.numero} a ${email}...`);

        // Simulación de envío vía API/SMTP
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Factura enviada con éxito.");
                resolve({ status: "sent", timestamp: new Date().toISOString() });
            }, 1500);
        });
    }

    async getDeliveryStatus(id) {
        return { status: "delivered", viewed: true };
    }
}

export default new EmailService();
