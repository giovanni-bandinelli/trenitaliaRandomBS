export class Calendar {

    constructor() {
        this.currentDate = new Date();
        this.selectedMonth = this.currentDate.getMonth();
        this.selectedYear = this.currentDate.getFullYear();
        this.trainDates = new Set(); // Set per memorizzare le date con treni o treni con sconto  Young disponibili
        this.discountDates = new Set();
        this.monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

        this.initDOMElements();
        this.attachEventListeners();
        this.renderCalendar();
    }

    initDOMElements() {
        this.calendarBody = document.getElementById('calendarBody');
        this.currentMonthDisplay = document.getElementById('currentMonth');
        this.prevMonthBtn = document.getElementById('prevMonth');
        this.nextMonthBtn = document.getElementById('nextMonth');
    }

    attachEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));
    }

    navigateMonth(direction) {
        this.selectedMonth += direction;
        if (this.selectedMonth > 11) {
            this.selectedMonth = 0;
            this.selectedYear++;
        } else if (this.selectedMonth < 0) {
            this.selectedMonth = 11;
            this.selectedYear--;
        }
        this.renderCalendar();
        }

        renderCalendar() {
            this.currentMonthDisplay.textContent = `${this.monthNames[this.selectedMonth]} ${this.selectedYear}`;
            
            // Calcola il primo giorno del mese (0=domenica, 6=sabato)
            let firstDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
            // Adatta per iniziare da lunedì (0=lunedì, 6=domenica)
            firstDay = firstDay === 0 ? 6 : firstDay - 1;
            
            const totalDays = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
            const prevMonthDays = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
            
            this.calendarBody.innerHTML = '';
            let dateCounter = 1;
            let nextMonthCounter = 1;
            
            for (let i = 0; i < 6; i++) { //i == "indice" settimana vista del calendario (sempre 6 settimane)
                const row = document.createElement('tr');
                
                for (let j = 0; j < 7; j++) { //j == "indice" giorno della settimana (0=lunedì, 6=domenica)
                    const cell = document.createElement('td');

                    if (i === 0 && j < firstDay) {
                        // Giorni del mese precedente
                        cell.textContent = prevMonthDays - firstDay + j + 1;
                        cell.classList.add('other-month');
                    } else if (dateCounter <= totalDays) {
                        // Giorni del mese corrente
                        cell.textContent = dateCounter;
                        
                        // Verifica se è il giorno corrente
                        if (this.isToday(dateCounter)) {
                            cell.classList.add('current-day');
                        }
                        
                        dateCounter++;
                    } else {
                        // Giorni del mese successivo
                        cell.textContent = nextMonthCounter++;
                        cell.classList.add('other-month');
                    }
                    
                    
                    //LOGICA AGGIUNTA ICONE CALENDARIO
                    // Verifica disponibilità treni e sconti
                    const hasTrain = this.hasTrain(dateCounter);
                    const hasDiscount = this.hasDiscount(dateCounter);
                    
                    // Se ci sono treni o sconti, aggiungi le icone
                    if (hasTrain || hasDiscount) {
                        const iconContainer = document.createElement('div');
                        iconContainer.className = 'icon-container';
                        
                        if (hasTrain) {
                            const trainIcon = document.createElement('i');
                            trainIcon.className = 'fas fa-train train-indicator';
                            iconContainer.appendChild(trainIcon);
                        }
                        
                        if (hasDiscount) {
                            const discountIcon = document.createElement('i');
                            discountIcon.className = 'fas fa-money-bill-wave discount-indicator';
                            iconContainer.appendChild(discountIcon);
                        }
                        
                        cell.appendChild(iconContainer);
                    }
                                        
                    row.appendChild(cell);
                }
                
                this.calendarBody.appendChild(row);
            }
        }
        

    isToday(day) {
        const today = new Date();
        return day === today.getDate() && this.selectedMonth === today.getMonth() && this.selectedYear === today.getFullYear();
    }

    hasTrain(day) {
        const dateString = new Date(this.selectedYear, this.selectedMonth, day).toISOString().split('T')[0];
        return Math.random() < 0.5;//this.trainDates.has(dateString) actual func logic will be changed when i try to implement API;
    }

    hasDiscount(day) {
        const dateString = new Date(this.selectedYear, this.selectedMonth, day).toISOString().split('T')[0];
        return Math.random() < 0.5;//this.trainDates.has(dateString);
    }

    addTrainIndicator(date) {
        this.trainDates.add(date.toISOString().split('T')[0]);
        this.renderCalendar();
    }
}
    