/**
 * Hacienda Pro - DigitalSigner
 * Lógica para la firma electrónica de facturas (XAdES/PAdES).
 */

class DigitalSigner {
    constructor() {
        this.certificateSet = !!localStorage.getItem('hpro_cert_active');
    }

    uploadCertificate(file) {
        // Simulación de carga y validación de certificado .p12
        console.log("Cargando certificado:", file.name);
        this.certificateSet = true;
        return { status: "success", info: "Certificado SL activo hasta 2028" };
    }

    setCertificateActive(isActive) {
        this.certificateSet = isActive;
    }

    async signInvoice(factura) {
        if (!this.certificateSet) {
            throw new Error("No hay un certificado digital configurado.");
        }

        // Simulación de firma criptográfica
        const signatureBase = `${factura.hash}|SIGNATURE_SALT_2026`;
        const signature = await this._generateFakeSignature(signatureBase);

        return {
            ...factura,
            signature,
            signedAt: new Date().toISOString(),
            signerNif: "B12345678",
            isSigned: true
        };
    }

    async _generateFakeSignature(data) {
        const encoder = new TextEncoder();
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
        return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
    }
}

export default new DigitalSigner();
