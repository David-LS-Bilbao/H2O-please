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
        this.dom.renderInitialUI(this.user);
        //this.dom.renderInitialUI();

        this.attachListeners();
        this.hoy();
        this.historial();

    }

    attachListeners() {
        const { drinkForm, amountInput } = this.dom.elements;

        if (drinkForm) {
            drinkForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const amount = parseInt(amountInput.value || "200", 10);
                if (Number.isNaN(amount) || amount <= 0) return;

                this.user.addWater(amount);
                saveUser(this.user);
                this.updateUI();
            });
        }
    }

    updateUI() {
        const { totalText, countdown, progress, dailyTarget } = this.dom.elements;

        totalText.textContent = `${this.user.waterConsumed} ml`;

        if (this.user.lastTimeConsumedUnix) {
            countdown.textContent =
                `Siguiente toma a las ${unixToTime(this.user.nextAlarm)}`;
        }

        const percent = Math.min(
            100,
            Math.round((this.user.waterConsumed / this.user.consumptionTarget) * 100)
        );
        progress.value = percent;
        dailyTarget.textContent = `${this.user.consumptionTarget} ml`;
    }

    hoy(params) {
        // 1. Selección de las secciones (vistas)
        const viewToday = document.getElementById('view-today');
        const viewHistory = document.getElementById('view-history');
        const viewMe = document.getElementById('view-me');

        // 2. Selección de los botones del footer
        const btnToday = document.getElementById('btn-today');
        const btnHistory = document.getElementById('btn-history');
        const btnMe = document.getElementById('btn-me');

        // 3. Función principal para cambiar de pestaña
        function cambiarPestaña(pestaña) {
            // Ocultamos todas primero
            viewToday.style.display = 'none';
            viewHistory.style.display = 'none';
            viewMe.style.display = 'none';

            // Mostramos la elegida
            if (pestaña === 'today') {
                viewToday.style.display = 'block';
            } else if (pestaña === 'history') {
                viewHistory.style.display = 'block';
                // Aquí puedes llamar a una función que cargue los datos si ya los tienes guardados
                console.log("Cargando historial...");
            } else if (pestaña === 'me') {
                viewMe.style.display = 'block';
            }
        }

        // 4. Asignar los eventos a los botones
        btnToday.addEventListener('click', () => cambiarPestaña('today'));
        btnHistory.addEventListener('click', () => cambiarPestaña('history'));
        btnMe.addEventListener('click', () => cambiarPestaña('me'));

    }

    
    historial(params){
        /**
 * DASHBOARD.JS - Gestión de Usuarios e Historial
 */

// --- 1. CONFIGURACIÓN INICIAL DE USUARIO ---
const username = localStorage.getItem('currentUser') || 'invitado';
const userKey = `userConsumption:${username}`;

// Cargamos los datos del usuario específico
let userData = JSON.parse(localStorage.getItem(userKey)) || {
    username: username,
    waterConsumed: 0,
    consumptionTarget: 2300,
    history: [], // Aquí guardaremos las tomas
    lastDate: new Date().toLocaleDateString()
};

// --- 2. SELECTORES DE ELEMENTOS ---
const views = {
    today: document.getElementById('view-today'),
    history: document.getElementById('view-history'),
    me: document.getElementById('view-me')
};

const buttons = {
    today: document.getElementById('btn-today'),
    history: document.getElementById('btn-history'),
    me: document.getElementById('btn-me')
};

const drinkForm = document.getElementById('drink-form');
const amountInput = document.getElementById('amount');
const totalDisplay = document.getElementById('total');
const historyContainer = document.getElementById('history-container');
const progressBar = document.getElementById('progress');

// --- 3. LÓGICA DE PERSISTENCIA Y RESET ---

function guardarDatos() {
    localStorage.setItem(userKey, JSON.stringify(userData));

}

function comprobarNuevoDia() {
    const hoy = new Date().toLocaleDateString();
    if (userData.lastDate !== hoy) {
        // Resetear para el nuevo día
        userData.waterConsumed = 0;
        userData.history = [];
        userData.lastTimeConsumed = hoy;
        guardarDatos();
    }
}

function actualizarInterfaz() {
    // Actualizar texto de mililitros
    totalDisplay.textContent = `${userData.waterConsumed} ml`;
    
    // Actualizar barra de progreso
    const porcentaje = (userData.waterConsumed / userData.consumptionTarget) * 100;
    progressBar.value = porcentaje;
}

// --- 4. FUNCIONES DE VISTA (PINTAR) ---

function cambiarVista(nombreVista) {
    // Ocultar todas las secciones
    Object.values(views).forEach(v => v.style.display = 'none');
    // Mostrar la actual
    views[nombreVista].style.display = 'block';

    if (nombreVista === 'history') {
        renderizarHistorial();
    }
}

function renderizarHistorial() {
    historyContainer.innerHTML = ''; // Limpiar contenedor

    if (!userData.history || userData.history.length === 0) {
        historyContainer.innerHTML = '<p style="text-align:center; padding:20px;">No hay tomas hoy.</p>';
        return;
    }

    // Crear la lista de tomas
    userData.history.forEach(toma => {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex; 
            justify-content: space-between; 
            padding: 12px; 
            border-bottom: 1px solid #eee;
            align-items: center;
        `;
        
        item.innerHTML = `
            <span style="font-weight:bold; color:#555;">${toma.hora}</span>
            <span style="color:#007bff; font-weight:bold;">+${toma.cantidad} ml</span>
        `;
        historyContainer.appendChild(item);
    });
}

// --- 5. EVENTOS ---

// Navegación de botones
buttons.today.addEventListener('click', () => cambiarVista('today'));
buttons.history.addEventListener('click', () => cambiarVista('history'));
buttons.me.addEventListener('click', () => cambiarVista('me'));

// Formulario de añadir agua
drinkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    comprobarNuevoDia();
    
    const cantidad = parseInt(amountInput.value);
    

         console.log(`cantidad igual a ${amountInput.value}`);
    
    if (cantidad > 0) {
        // Actualizar consumo
        userData.waterConsumed += cantidad;

        // Añadir al historial del usuario
        const nuevaToma = {
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cantidad: cantidad
            
        };
        if (!userData.history) userData.history = [];
        userData.history.unshift(nuevaToma); // El último va primero

        // Guardar y refrescar pantalla
        guardarDatos();
        actualizarInterfaz();
        
        amountInput.value = ''; // Limpiar el campo
    }
});

// --- 6. ARRANQUE INICIAL ---
comprobarNuevoDia();
actualizarInterfaz();
    }
}

export default App;