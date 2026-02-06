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

        console.log("📤 Sincronizando blob cifrado con SaaS Factory...");

        // Simulación: Guardamos en el backend de SaaS Factory
        localStorage.setItem('hpro_remote_sync_mock', encryptedBlob);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "success", timestamp: new Date().toISOString() });
            }, 800);
        });
    }

    async fetchRemoteData() {
        if (!this.isSubscribed) return null;

        console.log("📥 Descargando actualizaciones cifradas desde SaaS Factory...");

        // Simulación: Recuperamos el último blob guardado
        const remoteBlob = localStorage.getItem('hpro_remote_sync_mock');

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(remoteBlob || null);
            }, 1000);
        });
    }

    setSubscriptionStatus(status) {
        this.isSubscribed = status;
    }
}

export default new ApiService();
