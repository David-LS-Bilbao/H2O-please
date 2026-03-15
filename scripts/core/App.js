import DOMManager from "./DOMManager.js";
import { loadCurrentUser, saveUser } from "./storage.js";

// Función de utilidad para el tiempo
function unixToTime(unixSeconds) {
    const date = new Date(unixSeconds * 1000);
    return date.toLocaleTimeString("es-ES", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

class App {
    constructor() {
        this.dom = new DOMManager();
        this.user = null;
    }

    init() {
        this.user = loadCurrentUser();
        if (!this.user) {
            window.location.href = "index.html";
            return;
        }

        this.dom.cacheElements();
        this.verificarNuevoDia();
        this.dom.renderInitialUI(this.user);
        this.attachListeners();
        this.updateUI(); 
    }

    verificarNuevoDia() {
        const hoy = new Date().toLocaleDateString();
        if (this.user.lastDate !== hoy) {
            this.user.waterConsumed = 0;
            this.user.history = []; 
            this.user.lastDate = hoy;
            saveUser(this.user);
        }
    }

    attachListeners() {
        const { 
            drinkForm, amountInput, 
            btnToday, btnHistory, btnMe, 
            btnLogout,
            btnSaveProfile, editAge, editWeight // Nuevos elementos del DOMManager
        } = this.dom.elements;

        // --- Lógica de Beber ---
        if (drinkForm) {
            drinkForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const amount = parseInt(amountInput.value || "200");
                if (Number.isNaN(amount) || amount <= 0) return;

                this.user.addWater(amount);
                
                if (!this.user.history) this.user.history = [];
                this.user.history.unshift({
                    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    cantidad: amount
                });

                saveUser(this.user);
                this.updateUI();
                amountInput.value = "";
            });
        }
        if (btnSaveProfile) {
    btnSaveProfile.addEventListener("click", () => {
        // 1. Extraer valores de los inputs
        const nuevaEdad = parseInt(editAge.value) || 0;
        const nuevoPeso = parseInt(editWeight.value) || 0;

        // 2. Asignarlos al objeto usuario de la sesión actual
        this.user.age = nuevaEdad;
        this.user.weight = nuevoPeso;

        // 3. ¡IMPORTANTE! Guardar en el almacenamiento persistente
        saveUser(this.user); 
        
        alert("¡Datos del usuario guardados en el sistema!");
    });
}

        // --- Lógica Guardar Perfil (Edad y Peso) ---
        if (btnSaveProfile) {
            btnSaveProfile.addEventListener("click", () => {
                // Guardamos los valores de los inputs en el objeto user
                this.user.age = parseInt(editAge.value) || 0;
                this.user.weight = parseInt(editWeight.value) || 0;

                saveUser(this.user);
                alert("¡Perfil del usuario actualizado!");
            });
        }

        // --- Navegación (SPA) ---
        if (btnToday) btnToday.addEventListener('click', () => this.cambiarPestaña('today'));
        if (btnHistory) btnHistory.addEventListener('click', () => this.cambiarPestaña('history'));
        if (btnMe) btnMe.addEventListener('click', () => this.cambiarPestaña('me'));

        // --- Cerrar Sesión ---
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                localStorage.removeItem("currentUser");
                window.location.href = "index.html";
            });
        }
    }

    cambiarPestaña(pestaña) {
        const { viewToday, viewHistory, viewMe } = this.dom.elements;

        viewToday.style.display = 'none';
        viewHistory.style.display = 'none';
        viewMe.style.display = 'none';

        if (pestaña === 'today') {
            viewToday.style.display = 'block';
        } else if (pestaña === 'history') {
            viewHistory.style.display = 'block';
            this.renderizarHistorial();
        } else if (pestaña === 'me') {
            viewMe.style.display = 'block';
            this.renderizarPerfil();
        }
    }

    renderizarHistorial() {
        const { historyContainer } = this.dom.elements;
        if (!historyContainer) return;

        historyContainer.innerHTML = '';

        if (!this.user.history || this.user.history.length === 0) {
            historyContainer.innerHTML = '<p style="text-align:center; padding:20px; color: gray;">Sin registros hoy.</p>';
            return;
        }

        this.user.history.forEach(toma => {
            const item = document.createElement('div');
            item.style.cssText = "display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #eee; align-items:center;";
            item.innerHTML = `
                <span style="font-weight:bold; color:#555;">${toma.hora}</span>
                <span style="color:#007bff; font-weight:bold;">+${toma.cantidad} ml</span>
            `;
            historyContainer.appendChild(item);
        });
    }

    renderizarPerfil() {
        const { profileName, profileTarget, editAge, editWeight } = this.dom.elements;
        
        if (profileName) profileName.textContent = this.user.username;
        if (profileTarget) profileTarget.textContent = `${this.user.consumptionTarget} ml`;
        
    
        if (editAge) editAge.value = this.user.age || "";
        if (editWeight) editWeight.value = this.user.weight || "";
    }

    updateUI() {
        const { totalText, countdown, progress, dailyTarget } = this.dom.elements;

        totalText.textContent = `${this.user.waterConsumed} ml`;

        if (this.user.lastTimeConsumedUnix) {
            countdown.textContent = `Siguiente toma a las ${unixToTime(this.user.nextAlarm)}`;
        }

        const percent = Math.min(
            100,
            Math.round((this.user.waterConsumed / this.user.consumptionTarget) * 100)
        );
        progress.value = percent;
        dailyTarget.textContent = `${this.user.consumptionTarget} ml`;
    }
}

export default App;