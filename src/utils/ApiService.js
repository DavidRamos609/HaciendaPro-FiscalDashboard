/**
 * ApiService.js - Sincronización y Monetización
 * Gestiona la conexión con SaaS Factory y valida el estado de suscripción.
 */
class ApiService {
    constructor() {
        this.baseUrl = "/api/v1"; // Mock URL para SaaS Factory
        this.isSubscribed = true; // Por defecto true para la demo, se validará contra el server
    }

    async syncInvoices(encryptedBlob) {
        if (!this.isSubscribed) {
            throw new Error("Suscripción Inactiva: El servicio de sincronización requiere una cuota mensual activa.");
        }

        console.log("📤 Sincronizando blob cifrado con SaaS Factory...", encryptedBlob);

        // Simulación de llamada al backend PostgreSQL
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "success", timestamp: new Date().toISOString() });
            }, 800);
        });
    }

    async fetchRemoteInvoices() {
        console.log("📥 Descargando actualizaciones cifradas desde el servidor...");
        // Simulación: devuelve null si no hay cambios, o un blob si los hay
        return null;
    }

    setSubscriptionStatus(status) {
        this.isSubscribed = status;
    }
}

export default new ApiService();
