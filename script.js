document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const tasti = document.querySelectorAll('.tasto');
    let operazioneCorrente = '';
    let operazione = null;
    let risultatoPrecedente = null;

    tasti.forEach(tasto => {
        tasto.addEventListener('click', () => {
            const valore = tasto.textContent;

            if (valore === 'C') {
                clear();
            } else if (valore === '±') {
                toggleSign();
            } else if (valore === '=' || valore === '+' || valore === '-' || valore === '×' || valore === '÷') {
                handleOperator(valore);
            } else {
                appendNumber(valore);
            }

            updateDisplay();
        });
    });

    // Aggiungiamo un event listener per la tastiera
    document.addEventListener('keydown', handleKeyboardInput);

    function clear() {
        operazioneCorrente = '';
        operazione = null;
        risultatoPrecedente = null;
    }

    function toggleSign() {
        operazioneCorrente = (-parseFloat(operazioneCorrente)).toString();
    }

    function appendNumber(numero) {
        if (numero === '.' && operazioneCorrente.includes('.')) return;
        if (operazioneCorrente === '0' && numero !== '.') {
            operazioneCorrente = numero;
        } else {
            // Limitiamo il numero di cifre a 16, escludendo il separatore decimale
            if (operazioneCorrente.replace(/[.,]/g, '').length < 16) {
                operazioneCorrente += numero;
            }
        }
    }

    function handleOperator(op) {
        if (operazioneCorrente === '' && risultatoPrecedente === null) {
            // Aggiungiamo questa condizione per gestire il numero negativo iniziale
            if (op === '-') {
                operazioneCorrente = '-';
                updateDisplay();
            }
            return;
        }
        
        if (operazioneCorrente !== '') {
            if (risultatoPrecedente !== null) {
                calculate();
            } else {
                risultatoPrecedente = parseFloat(operazioneCorrente);
            }
        }
        
        operazione = op;
        
        if (op !== '=') {
            operazioneCorrente = '';
        }
        
        updateDisplay();
    }

    function calculate() {
        let risultato;
        const prev = risultatoPrecedente;
        const current = parseFloat(operazioneCorrente);
        if (isNaN(prev) || isNaN(current)) return;
        switch (operazione) {
            case '+':
                risultato = prev + current;
                break;
            case '-':
                risultato = prev - current;
                break;
            case '×':
                risultato = prev * current;
                break;
            case '÷':
                risultato = prev / current;
                break;
            default:
                return;
        }
        operazioneCorrente = risultato.toString();
        operazione = null;
        risultatoPrecedente = null;
    }

    function updateDisplay() {
        let displayValue = '';
        if (operazioneCorrente !== '') {
            displayValue = formatNumber(operazioneCorrente);
        } else if (risultatoPrecedente !== null) {
            displayValue = formatNumber(risultatoPrecedente.toString());
        } else {
            displayValue = '0';
        }
        display.textContent = displayValue;
        adjustFontSize();
    }

    function formatNumber(numero) {
        // Separiamo la parte intera dalla parte decimale
        let [parteIntera, parteDecimale] = numero.split('.');
        
        // Aggiungiamo il separatore delle migliaia alla parte intera
        parteIntera = parteIntera.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        // Se c'è una parte decimale, la aggiungiamo con la virgola come separatore
        if (parteDecimale) {
            return `${parteIntera},${parteDecimale}`;
        } else {
            return parteIntera;
        }
    }

    function adjustFontSize() {
        const displayWidth = display.offsetWidth;
        const textWidth = display.scrollWidth;
        const currentFontSize = parseFloat(window.getComputedStyle(display).fontSize);

        if (textWidth > displayWidth) {
            const newFontSize = currentFontSize * displayWidth / textWidth;
            display.style.fontSize = `${newFontSize}px`;
        } else {
            display.style.fontSize = ''; // Ripristina la dimensione del font predefinita
        }
    }

    function handleKeyboardInput(event) {
        const key = event.key;

        if (/[0-9,]/.test(key)) {
            appendNumber(key === ',' ? '.' : key);
        } else if (key === 'Enter') {
            handleOperator('=');
        } else if (key === '+' || key === '-') {
            handleOperator(key);
        } else if (key === '*') {
            handleOperator('×');
        } else if (key === '/') {
            handleOperator('÷');
        } else if (key === 'Escape' || key === 'Delete') {
            clear();
        } else if (key === 'Backspace') {
            cancellaCifra();
        }

        updateDisplay();
    }

    function cancellaCifra() {
        operazioneCorrente = operazioneCorrente.slice(0, -1);
        if (operazioneCorrente === '') {
            operazioneCorrente = '0';
        }
    }
});
