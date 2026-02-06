/**
 * Hacienda Pro - Facturador Verifactu
 * Cumple con el Reglamento de Facturación de 2026 (España).
 */

class Facturador {
    constructor() {
        this.facturas = JSON.parse(localStorage.getItem('hpro_facturas_emitidas')) || [];
        this.emisor = JSON.parse(localStorage.getItem('hpro_emisor_data')) || {
            nombre: "Nombre de tu Empresa/SL",
            nif: "B12345678",
            direccion: "Domicilio Fiscal Completo",
            iban: "ES00 0000 0000 0000 0000 0000",
            certificados: [], // [{id, nombre, rol, file}]
            certSeleccionado: null
        };
        this.serie = "2026-SL";
    }

    setEmisor(datos) {
        this.emisor = { ...this.emisor, ...datos };
        localStorage.setItem('hpro_emisor_data', JSON.stringify(this.emisor));
    }

    async emitirFactura(datos) {
        const ultimaFactura = this.facturas[this.facturas.length - 1];
        const hashAnterior = ultimaFactura ? ultimaFactura.hash : "0000000000000000000000000000000000000000000000000000000000000000";

        const numero = this.facturas.length + 1;
        const fecha = new Date().toISOString();
        const subtotal = parseFloat(datos.base);

        // IVA Variable
        const tipoIva = datos.tipoIva || 0.21;
        const iva = subtotal * tipoIva;

        // IRPF (Retención Alquileres 19%)
        const irpf = datos.esAlquiler ? subtotal * 0.19 : 0;

        const total = subtotal + iva - irpf;

        // Lógica de Verifactu: Hash encadenado
        const dataString = `${hashAnterior}|${this.serie}|${numero}|${fecha}|${total.toFixed(2)}`;
        const hashActual = await this._generateHash(dataString);

        const nuevaFactura = {
            serie: this.serie,
            numero,
            fecha,
            emisor: this.emisor,
            iban: this.emisor.iban,
            certFirma: this.emisor.certSeleccionado,
            cliente: datos.cliente,
            nif: datos.nif,
            domicilioCliente: datos.domicilioCliente || "No especificado",
            concepto: datos.concepto || "Servicios profesionales",
            rectificativa: !!datos.rectificativa,
            facturaAnulada: datos.facturaAnulada || null, // ID de la factura que anula
            base: subtotal,
            tipoIva: tipoIva * 100,
            iva,
            esAlquiler: !!datos.esAlquiler,
            irpf,
            total,
            hash: hashActual,
            hashAnterior,
            qrUrl: this._generateQRUrl(this.serie, numero, fecha, total),
            leyenda: "Factura verificable en la sede electrónica de la AEAT - VERIFACTU"
        };

        this.facturas.push(nuevaFactura);
        this._save();
        return nuevaFactura;
    }

    async _generateHash(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    _generateQRUrl(serie, numero, fecha, total) {
        const baseUrl = "https://www2.agenciatributaria.gob.es/wlpl/TIKE-CONT/v1/qr/";
        const params = `?nif=B12345678&serie=${serie}&numero=${numero}&fecha=${fecha.split('T')[0]}&importe=${total.toFixed(2)}`;
        return baseUrl + params;
    }

    _save() {
        localStorage.setItem('hpro_facturas_emitidas', JSON.stringify(this.facturas));
    }

    getHistory() {
        return this.facturas;
    }

    resetData() {
        localStorage.removeItem('hpro_facturas_emitidas');
        localStorage.removeItem('hpro_emisor_data');
        this.facturas = [];
        this.emisor = {
            nombre: "Nombre de tu Empresa/SL",
            nif: "B00000000",
            direccion: "Dirección Fiscal",
            iban: "ES00 0000 0000 0000 0000 0000",
            certificados: [],
            certSeleccionado: null
        };
        this._save();
    }

    async anularFactura(facturaId) {
        const facturaOriginal = this.facturas.find(f => f.numero === facturaId);
        if (!facturaOriginal) throw new Error("Factura no encontrada");
        if (facturaOriginal.anulada) throw new Error("La factura ya está anulada");

        // Crear rectificativa de signo contrario
        const datosAnulacion = {
            cliente: facturaOriginal.cliente,
            nif: facturaOriginal.nif,
            domicilioCliente: facturaOriginal.domicilioCliente,
            concepto: `ANULACIÓN de factura ${facturaOriginal.serie}-${facturaOriginal.numero}`,
            base: -facturaOriginal.base,
            rectificativa: true,
            facturaAnulada: facturaOriginal.numero
        };

        const rectificativa = await this.emitirFactura(datosAnulacion);
        facturaOriginal.anulada = true;
        facturaOriginal.idRectificativa = rectificativa.numero;
        this._save();
        return rectificativa;
    }

    addCertificado(cert) {
        this.emisor.certificados.push(cert);
        if (!this.emisor.certSeleccionado) this.emisor.certSeleccionado = cert;
        this._save();
    }
}

export default new Facturador();
