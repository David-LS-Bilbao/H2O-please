import DOMManager from "./DOMManager.js";
import { loadCurrentUser, saveUser } from "./storage.js";

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
            btnLogout, btnSaveProfile, 
            editAge, editWeight 
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

        // --- Lógica de Guardar Perfil (Cálculo dinámico 35ml/kg) ---
        if (btnSaveProfile) {
            btnSaveProfile.addEventListener("click", () => {
                const nuevaEdad = parseInt(editAge.value) || 0;
                const nuevoPeso = parseInt(editWeight.value) || 0;

                if (nuevoPeso <= 0) {
                    alert("Por favor, introduce un peso válido.");
                    return;
                }

                this.user.age = nuevaEdad;
                this.user.weight = nuevoPeso;

                // Calculamos la meta según el peso
                this.user.calculateTarget(); 

                // Guardamos en LocalStorage
                saveUser(this.user);
                
                // Actualizamos toda la interfaz
                this.renderizarPerfil();
                this.updateUI(); 

                alert(`¡Perfil actualizado! Tu nueva meta es ${this.user.consumptionTarget} ml`);
            });
        }

        // --- Navegación ---
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

        if (pestaña === 'today') viewToday.style.display = 'block';
        if (pestaña === 'history') {
            viewHistory.style.display = 'block';
            this.renderizarHistorial();
        }
        if (pestaña === 'me') {
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
        if (totalText) totalText.textContent = `${this.user.waterConsumed} ml`;
        if (dailyTarget) dailyTarget.textContent = `${this.user.consumptionTarget} ml`;

        if (this.user.lastTimeConsumedUnix && countdown) {
            countdown.textContent = `Siguiente toma a las ${unixToTime(this.user.nextAlarm)}`;
        }

        if (progress) {
            const percent = Math.min(100, Math.round((this.user.waterConsumed / this.user.consumptionTarget) * 100));
            progress.value = percent;
        }
    }
}

export default App;