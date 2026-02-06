/**
 * AuthService.js - Gestión de Identidad Fiscal
 * Mantiene la sesión del usuario de forma local para máxima privacidad.
 */
class AuthService {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('hpro_auth_user')) || null;
    }

    login(username, password) {
        // Simulación de validación (en PWA local, el usuario define su acceso inicial)
        if (username && password.length >= 4) {
            this.user = {
                id: 'user_1',
                name: username,
                role: 'admin',
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem('hpro_auth_user', JSON.stringify(this.user));
            return true;
        }
        return false;
    }

    logout() {
        this.user = null;
        localStorage.removeItem('hpro_auth_user');
        location.reload();
    }

    isAuthenticated() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }
}

export default new AuthService();
