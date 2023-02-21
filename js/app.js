// VARIABLES Y SELECTORES

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
const modalForm = document.querySelector('.modal-body form')


// EVENTOS

cargarEventListeners();
function cargarEventListeners() {
    modalForm.addEventListener('submit', pedirPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}


// CLASES

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto); //  cuando inicia es igual al presup total
        this.gastos = [];
    }

    // metodo que va a agregar un nuevo gasto al array
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 ) 
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
    }
    
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id != id );
        this.calcularRestante();
    }

}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    insertarAlerta(mensaje, tipo) {
        // crear el div
        const divAlerta = document.createElement('div');

        // agrego clases de bootstrap
        divAlerta.classList.add('text-center', 'alert', 'mt-3')

        if(tipo === 'error') {
            divAlerta.classList.add('alert-danger')
        } else {
            divAlerta.classList.add('alert-success')
        }

        // Agrego el mensaje
        divAlerta.innerHTML = `<p>${mensaje}</p>`;

        // inserto el mensaje en el html
        document.querySelector('.contenido.primario').insertBefore(divAlerta, formulario)
        
        // borro el mensaje despues de 3 segungod
        setTimeout(() => {
            divAlerta.remove()
        }, 2000);
    }


    listarGastos(gastos){

        // limpio el html 
        this.limpiarHTML()

        // iterar sobre los gastos

        gastos.forEach(gasto => {

            

            const {cantidad, nombre, id} = gasto;

            const gastoHTML = document.createElement('li');
            gastoHTML.className = 'list-group-item d-flex justify-content-between align-items-center';

            // asigno el id al elemento html
            gastoHTML.dataset.id = id;  // gastoHTML.setAttribute('data-id', id) => otra forma

             // agregar el  html
            gastoHTML.innerHTML = `${nombre} <span class = 'badge badge-primary badge-pill'>$${cantidad}</span>`

            // agrego button para borrar
            const borrarBtn = document.createElement('button');
            borrarBtn.classList.add('btn', 'btn-danger', 'borrar-gasto');
            borrarBtn.innerHTML = 'borrar <i class="fa-sharp fa-solid fa-trash"></i>'
            borrarBtn.onclick = () => eliminarGasto(id);
            gastoHTML.appendChild(borrarBtn);
            
            //inserto en el div
            gastoListado.appendChild(gastoHTML)

        });
    }
    
    limpiarHTML() {
        const listaGastos = document.querySelector('.list-group');
        while(listaGastos.firstChild){
            listaGastos.removeChild(listaGastos.firstChild)
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante; 
    }

    comprobarPresupuesto(presupuestoObj){
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')
        

        // comprobar si se gasto el 25%
      
        if(restante / presupuesto < 0.25) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if(restante / presupuesto < 0.5) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        
        // si el total es 0 o menor

        if(restante <= 0){
            formulario.querySelector("button[type='submit']").disabled = true;
        } else {
            formulario.querySelector("button[type='submit']").disabled = false;
        }

    }

}




// instanciar
const ui = new UI();






// FUNCIONES
let presupuesto;

function pedirPresupuesto(e) {
    e.preventDefault();

    const presupuestoUsuario = document.querySelector('.modal-body form input').value
    
/* 
    if(presupuestoUsuario === 0 || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        
    } */
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
    presupuesto.calcularRestante()
    ui.comprobarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault;
    // leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    // validar datos
    if(nombre === '' || cantidad === '') {
        ui.insertarAlerta('Ambos campos son obligatorios', 'error');
        return
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.insertarAlerta('Cantidad no valida', 'error')
        return
    }
    
    // generar un objeto con el gasto con object literal enhancement
    const gasto = { nombre, cantidad, id: Date.now() } 


    // agrego el gasto al array
    presupuesto.nuevoGasto(gasto);
    ui.insertarAlerta('Gasto agregado correctamente')

    // reinicia el form
    formulario.reset()


    //Listar los gastos en html
    const { gastos, restante } = presupuesto; // para no pasar el objeto completo

    ui.actualizarRestante(restante);
    ui.listarGastos(gastos);
    ui.comprobarPresupuesto(presupuesto)

}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);

    const {gastos, restante} = presupuesto;
    ui.listarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
