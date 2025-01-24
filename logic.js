// logic.js
document.addEventListener("DOMContentLoaded", function () {
    // Función para obtener los datos del usuario desde localStorage
    function getUserData() {
        return JSON.parse(localStorage.getItem("user"));
    }

    // Función para guardar los datos del usuario en localStorage
    function saveUserData(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    // 1. Crear cuenta
    document.getElementById("create-account-form")?.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const doc = document.getElementById("doc").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = {
            name: name,
            doc: doc,
            email: email,
            password: password,
            balance: 0,
            movements: [],
        };

        saveUserData(user);
        alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
        window.location.href = "login.html"; // Redirigir a login
    });

    // 2. Iniciar sesión
    document.getElementById("login-form")?.addEventListener("submit", function (e) {
        e.preventDefault();

        const doc = document.getElementById("login-doc").value;
        const password = document.getElementById("login-password").value;

        const user = getUserData();

        if (user && user.doc === doc && user.password === password) {
            window.location.href = "inicio.html"; // Redirigir a inicio
        } else {
            alert("Documento o contraseña incorrectos.");
        }
    });

    // 3. Función para realizar un depósito
    document.getElementById("deposit-form")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const depositAmount = parseFloat(document.getElementById("deposit-amount").value);
        const user = getUserData();

        if (user) {
            if (depositAmount <= 0) {
                alert("La cantidad a consignar debe ser mayor que 0.");
                return;
            }

            user.balance += depositAmount; // Aumentar el saldo
            const movement = {
                type: "Consignación",
                amount: depositAmount,
                date: new Date().toLocaleString(),
                balance: user.balance,
            };

            user.movements.push(movement); // Registrar el movimiento
            saveUserData(user);

            alert(`Depósito exitoso. Nuevo saldo: $${user.balance.toFixed(2)}`);
            window.location.href = "inicio.html"; // Redirigir a inicio
        } else {
            alert("No se encontró el usuario. Por favor, inicia sesión.");
        }
    });

    // 4. Función para realizar un retiro
    document.getElementById("withdraw-form")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const withdrawAmount = parseFloat(document.getElementById("withdraw-amount").value);
        const user = getUserData();

        if (user) {
            if (withdrawAmount <= 0 || withdrawAmount > user.balance) {
                alert("No tienes suficiente saldo o la cantidad a retirar es inválida.");
                return;
            }

            const code = Math.floor(100000 + Math.random() * 900000); // Generar código aleatorio
            alert(`Tu código de seguridad es: ${code}`);

            const enteredCode = prompt("Introduce el código para confirmar el retiro:");
            if (parseInt(enteredCode) === code) {
                user.balance -= withdrawAmount; // Reducir el saldo
                const movement = {
                    type: "Retiro",
                    amount: withdrawAmount,
                    date: new Date().toLocaleString(),
                    balance: user.balance,
                };

                user.movements.push(movement); // Registrar el movimiento
                saveUserData(user);

                alert(`Retiro exitoso. Nuevo saldo: $${user.balance.toFixed(2)}`);
                window.location.href = "inicio.html"; // Redirigir a inicio
            } else {
                alert("Código incorrecto. No se pudo realizar el retiro.");
            }
        } else {
            alert("No se encontró el usuario. Por favor, inicia sesión.");
        }
    });

    // 5. Función para pagar servicios
    document.getElementById("pay-service-form")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const serviceType = document.querySelector('input[name="service"]:checked').value;
        const user = getUserData();

        if (user) {
            const servicePrice = serviceType === "agua" ? 50 : serviceType === "gas" ? 30 : 20; // Precios ficticios
            if (user.balance < servicePrice) {
                alert("No tienes suficiente saldo para pagar este servicio.");
                return;
            }

            user.balance -= servicePrice; // Reducir el saldo
            const movement = {
                type: "Pago de Servicio",
                amount: servicePrice,
                date: new Date().toLocaleString(),
                balance: user.balance,
                service: serviceType,
            };

            user.movements.push(movement); // Registrar el movimiento
            saveUserData(user);

            alert(`Pago de ${serviceType} realizado. Nuevo saldo: $${user.balance.toFixed(2)}`);
            window.location.href = "inicio.html"; // Redirigir a inicio
        } else {
            alert("No se encontró el usuario. Por favor, inicia sesión.");
        }
    });

    // 6. Función para ver los movimientos de la cuenta
    document.getElementById("view-movements")?.addEventListener("click", function () {
        const user = getUserData();

        if (user && user.movements.length > 0) {
            const movementsList = user.movements.map(movement => {
                return `
                    Fecha: ${movement.date}
                    Tipo: ${movement.type}
                    Monto: $${movement.amount.toFixed(2)}
                    Saldo actual: $${movement.balance.toFixed(2)}
                    ${movement.service ? `Servicio: ${movement.service}` : ""}
                    ----------------------------------------
                `;
            }).join("\n");

            document.getElementById("movements-list").textContent = movementsList;
        } else {
            alert("No hay movimientos registrados.");
        }
    });

    // Función para manejar el cierre de sesión
    document.getElementById("logout")?.addEventListener("click", function () {
        localStorage.removeItem("user");
        window.location.href = "banco.html"; // Redirigir al banco (login/crear cuenta)
    });

    // Función para obtener los datos del usuario y mostrar en la página de inicio
    const user = getUserData();
    if (user) {
        document.getElementById("user-name").textContent = user.name;
    }
});
