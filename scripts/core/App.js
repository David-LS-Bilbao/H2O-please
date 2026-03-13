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
        
        // Comprobar reset diario al iniciar
        this.verificarNuevoDia();
        
        this.dom.renderInitialUI(this.user);
        this.attachListeners();
        this.updateUI(); // Actualizar todo al cargar
    }

    verificarNuevoDia() {
        const hoy = new Date().toLocaleDateString();
        // Asumiendo que tu objeto user tiene una propiedad lastDate
        if (this.user.lastDate !== hoy) {
            this.user.waterConsumed = 0;
            this.user.history = []; // Inicializamos historial si no existe
            this.user.lastDate = hoy;
            saveUser(this.user);
        }
    }

    attachListeners() {
        const { drinkForm, amountInput, btnToday, btnHistory, btnMe } = this.dom.elements;

        // --- Lógica de Beber ---
        if (drinkForm) {
            drinkForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const amount = parseInt(amountInput.value || "200");
                if (Number.isNaN(amount) || amount <= 0) return;

                // 1. Añadir agua
                this.user.addWater(amount);
                
                // 2. Añadir al historial (Creamos el array si no existe)
                if (!this.user.history) this.user.history = [];
                this.user.history.unshift({
                    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    cantidad: amount
                });

                // 3. Guardar y refrescar
                saveUser(this.user);
                this.updateUI();
                amountInput.value = "";
            });
        }

        // --- Lógica de Navegación (Botones Footer) ---
        if (btnToday) btnToday.addEventListener('click', () => this.cambiarPestaña('today'));
        if (btnHistory) btnHistory.addEventListener('click', () => this.cambiarPestaña('history'));
        if (btnMe) btnMe.addEventListener('click', () => this.cambiarPestaña('me'));
    }

    cambiarPestaña(pestaña) {
        const { viewToday, viewHistory, viewMe } = this.dom.elements;

        // Ocultar todas
        viewToday.style.display = 'none';
        viewHistory.style.display = 'none';
        viewMe.style.display = 'none';

        // Mostrar la seleccionada
        if (pestaña === 'today') {
            viewToday.style.display = 'block';
        } else if (pestaña === 'history') {
            viewHistory.style.display = 'block';
            this.renderizarHistorial();
        } else if (pestaña === 'me') {
            viewMe.style.display = 'block';
        }
    }

    renderizarHistorial() {
        const { historyContainer } = this.dom.elements;
        if (!historyContainer) return;

        historyContainer.innerHTML = '';

        if (!this.user.history || this.user.history.length === 0) {
            historyContainer.innerHTML = '<p style="text-align:center; padding:20px;">No hay registros hoy.</p>';
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
