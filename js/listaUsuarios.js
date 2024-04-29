document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    cargarTabla();
    document.getElementById("txtNombre").onkeyup = e => revisarControl(e, 2, 60);
    document.getElementById("txtTelefono").onkeyup = e => {
        if (e.target.value.trim().length > 0)
            revisarControl(e, 10, 10);
    }
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }

    document.getElementById("btnLimpiar").addEventListener("click", e => {
        e.target.form.classList.remove("validado");
        let controles = e.target.form.querySelectorAll("input,select");
        controles.forEach(control => {
            control.classList.remove("valido");
            control.classList.remove("novalido");
        });
    });

    document.getElementById("btnAceptar").addEventListener("click", e => {
        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

        e.target.form.classList.add("validado");
        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");

        validarFormulario(txtNombre, txtContrasenia, txtContrasenia2, txtEmail, txtTel, e);

        // Si el formulario es válido, guardamos los cambios
        if (e.target.form.checkValidity()) {
            guardarCambios();
        }
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        let operacion = e.relatedTarget.innerText;

        document.querySelector("#mdlRegistro .modal-title").innerText = operacion;

        if (operacion == 'Editar') {
            cargarDatosUsuario(e);
            document.getElementById("txtPassword").disabled = true;
            document.getElementById("txtConfirmarPassword").disabled = true;
        } else {
            document.getElementById("txtPassword").disabled = false;
            document.getElementById("txtConfirmarPassword").disabled = false;
        }
        document.getElementById("txtNombre").focus();
    });
});

function revisarControl(e, min, max) {
    let txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min || txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        txt.classList.add("valido");
    }
}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = '';

    for (var i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        let fila = document.createElement("tr");

        let celda = document.createElement("td");
        celda.innerHTML = `<a href="#" data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="${usuario.correo}" onclick="editar(${i})">${usuario.nombre}</a>`;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        tbody.appendChild(fila);
    }
}
//reaaal
function editar(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let usuario = usuarios[index];

    document.getElementById("txtIndex").value = index;
    document.getElementById("txtNombre").value = usuario.nombre;
    document.getElementById("txtEmail").value = usuario.correo;
    document.getElementById("txtTelefono").value = usuario.telefono;
    document.getElementById("txtPassword").value = ''; // Limpiar campo de contraseña
    document.getElementById("txtConfirmarPassword").value = ''; // Limpiar campo de confirmar contraseña
    document.getElementById("txtPassword").disabled = true; // Deshabilitar campo de contraseña
    document.getElementById("txtConfirmarPassword").disabled = true; // Deshabilitar campo de confirmar contraseña
}

function validarFormulario(txtNombre, txtContrasenia, txtContrasenia2, txtEmail, txtTel, e) {
    txtNombre.setCustomValidity("");
    txtContrasenia.setCustomValidity("");
    txtContrasenia2.setCustomValidity("");
    txtEmail.setCustomValidity("");
    txtTel.setCustomValidity("");

    if (txtNombre.value.trim().length < 2 || txtNombre.value.trim().length > 60) {
        txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
    }
    if (txtContrasenia.value.trim().length < 6 || txtContrasenia.value.trim().length > 20) {
        txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 6 y 20 caracteres)");
    }
    if (txtContrasenia2.value.trim().length < 6 || txtContrasenia2.value.trim().length > 20) {
        txtContrasenia2.setCustomValidity("Confirma la contraseña");
    }
    if (txtTel.value.trim().length > 0 && txtTel.value.trim().length != 10) {
        txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
    }

    if (!e.target.form.checkValidity()) {
        e.preventDefault();
    }
}

function cargarDatosUsuario(e) {
    let correo = e.relatedTarget.value;
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let usuario = usuarios.find(element => element.correo == correo);

    document.getElementById("txtNombre").value = usuario.nombre;
    document.getElementById("txtEmail").value = usuario.correo;
    document.getElementById("txtTelefono").value = usuario.telefono;
    document.getElementById("txtCorreoOriginal").value = usuario.correo;
}

function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
        usuarios = [{
            nombre: 'Uriel Perez Gomez',
            correo: 'uriel@gmail.com',
            password: '123456',
            telefono: ''
        }, {
            nombre: 'Lorena Garcia Hernandez',
            correo: 'lorena@gmail.com',
            password: '567890',
            telefono: '4454577468'
        }];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}
//reaal
function guardarCambios() {
    let index = document.getElementById("txtIndex").value;
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let txtEmail = document.getElementById("txtEmail").value;
    
    // Verificar si el correo ya existe en otro usuario
    let correoExistente = usuarios.some((usuario, idx) => usuario.correo === txtEmail && idx.toString() !== index);
    
    if (correoExistente) {
        alert("El correo electrónico ya está en uso. Por favor, utiliza otro correo.");
        return; // Detener la ejecución si el correo ya está en uso
    }

    // Si no hay un índice definido, estamos agregando un nuevo usuario
    if (index === "") {
        let nuevoUsuario = {
            nombre: document.getElementById("txtNombre").value,
            correo: txtEmail,
            telefono: document.getElementById("txtTelefono").value,
            password: document.getElementById("txtPassword").value
        };
        usuarios.push(nuevoUsuario);
    } else {
        // Actualizar los datos del usuario existente
        usuarios[index].nombre = document.getElementById("txtNombre").value;
        usuarios[index].correo = txtEmail;
        usuarios[index].telefono = document.getElementById("txtTelefono").value;
        usuarios[index].password = document.getElementById("txtPassword").value;
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cargarTabla();
    alert("Usuario actualizado correctamente.");
}



// Función para cargar la tabla de usuarios
function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = '';

    for (let i = 0; i < usuarios.length; i++) {
        let usuario = usuarios[i];
        let fila = document.createElement("tr");

        let celda = document.createElement("td");
        celda.innerHTML = `<a href="#" data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="${usuario.correo}" onclick="editar(${i})">${usuario.nombre}</a>`;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        // Botón de Eliminar
        celda = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger");
        btnEliminar.innerText = "Eliminar";
        btnEliminar.onclick = () => mostrarModalConfirmacion(i);
        celda.appendChild(btnEliminar);
        fila.appendChild(celda);
        
        // Botón de Restablecer Contraseña
        let celdaRestablecer = document.createElement("td");
        let btnRestablecer = document.createElement("button");
        btnRestablecer.classList.add("btn", "btn-warning");
        btnRestablecer.innerText = "Restablecer contraseña";
        btnRestablecer.setAttribute("data-bs-toggle", "modal");
        btnRestablecer.setAttribute("data-bs-target", "#mdlRestablecerPassword");
        btnRestablecer.onclick = () => {
            document.getElementById("txtIndex").value = i; // Setear el índice del usuario actual
            // Aquí puedes agregar cualquier otra lógica que necesites ejecutar cuando se abre el modal
        };
        celdaRestablecer.appendChild(btnRestablecer);
        fila.appendChild(celdaRestablecer);

        // Botón de Editar
        let celdaEditar = document.createElement("td");
        let btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-primary");
        btnEditar.innerText = "Editar";
        btnEditar.setAttribute("data-bs-toggle", "modal");
        btnEditar.setAttribute("data-bs-target", "#mdlRegistro");
        btnEditar.onclick = () => editar(i);
        celdaEditar.appendChild(btnEditar);
        fila.appendChild(celdaEditar);



        tbody.appendChild(fila);
    
    }
}
document.addEventListener("DOMContentLoaded", function() {
    

    const nuevaPassword = document.getElementById("nuevaPassword");
    const confirmarPassword = document.getElementById("confirmarPassword");

    // Personalizar mensaje de validación para nueva contraseña
    nuevaPassword.oninput = function() {
        if (nuevaPassword.validity.patternMismatch) {
            nuevaPassword.setCustomValidity("La contraseña es obligatoria (entre 6 y 20 caracteres).");
        } else {
            nuevaPassword.setCustomValidity("");
        }
    };

    // Personalizar mensaje de validación para confirmar contraseña
    confirmarPassword.oninput = function() {
        if (confirmarPassword.validity.patternMismatch) {
            confirmarPassword.setCustomValidity("La contraseña es obligatoria (entre 6 y 20 caracteres).");
        } else {
            confirmarPassword.setCustomValidity("");
        }
    }
    const formCambiarContrasena = document.getElementById("formCambiarContrasena");

    formCambiarContrasena.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el envío estándar del formulario

        const index = document.getElementById("txtIndex").value;
        const passwordActual = document.getElementById("passwordActual").value;
        const nuevaPassword = document.getElementById("nuevaPassword").value;
        const confirmarPassword = document.getElementById("confirmarPassword").value;

        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios[index];

        // Verificar que la contraseña actual es correcta
        if (usuario.password !== passwordActual) {
            alert("La contraseña actual no es correcta.");
            return;
        }

        // Validación de longitud de la nueva contraseña
        if (nuevaPassword.length < 6 || nuevaPassword.length > 20) {
            alert("La nueva contraseña debe tener entre 6 y 20 caracteres.");
            return;
        }

        // Verificar que la nueva contraseña y su confirmación coincidan
        if (nuevaPassword !== confirmarPassword) {
            alert("Las nuevas contraseñas no coinciden.");
            return;
        }

        // Actualizar la contraseña en el almacenamiento local
        usuario.password = nuevaPassword;
        usuarios[index] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Contraseña actualizada correctamente para ' + usuario.nombre);

        // Cerrar el modal y limpiar el formulario
        var modalElement = document.getElementById('mdlRestablecerPassword');
        var modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        formCambiarContrasena.reset(); // Opcional: limpiar el formulario después del uso
        
    });
});




// Función para mostrar el modal de confirmación para eliminar un usuario
function mostrarModalConfirmacion(index) {
    const modalConfirmacion = new bootstrap.Modal(document.getElementById('mdlConfirmacionEliminar'));
    modalConfirmacion.show();

    // Evento click para el botón de confirmar eliminar
    document.getElementById('btnConfirmarEliminar').onclick = () => {
        eliminarUsuario(index);
        modalConfirmacion.hide();
    };
}

// Función para eliminar un usuario de la lista y actualizar la tabla
function eliminarUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    usuarios.splice(index, 1); // Eliminar el usuario en el índice proporcionado
    localStorage.setItem('usuarios', JSON.stringify(usuarios)); // Actualizar localStorage
    cargarTabla(); // Actualizar tabla de usuarios
}
