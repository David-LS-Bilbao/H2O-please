class DOMManager {
    constructor() {

    }

    createHTML() {
        const progress = document.createElement("progress");
        progress.classList.add("side-progress")
        
        progress.min = 0;
        progress.max = 100;
        progress.value = 0;

        //const article = document.createElement("article");
        //article.classList.add("")

        const accumulator = document.createElement("p");
        accumulator.classList.add("acumulated");

        const statCard = document.createElement("p");
        statCard.classList.add("stat-card");

        const objective = document.createElement("p");
        objective.classList.add("stat-card");

        const timerCountdown = document.createElement("time");
        timerCountdown.classList.add("countdown");

        const inputContainer = document.createElement("form");
        inputContainer.classList.add("input-container");

        const label = document.createElement("label");
        label.htmlFor = "amount";
        label.textContent = "Ingrese la cantidad";

        const amountInput = document.createElement("input");
        amountInput.type = "number";
        amountInput.id = "amount";
        amountInput.placeholder = "200";

        const drinkButton = document.createElement("button");
        drinkButton.classList.add("drink-button");

        return progress, accumulator, statCard, objective, timerCountdown, inputContainer, label, amountInput, drinkButton
    }


    renderHTML() {
        const appLayout = document.querySelector('.app-layout');
        appLayout.append(this.createHTML())
        //appLayout.innerHTML="<p>he borrado todo lo que hay dentro de app-layout</p>"
        //appLayout.innerHTML=this.createHTML();
    }

}

export default DOMManager;
