const socket = io();
function actualizarMesa(id, estado) {
  fetch('/mesas/estado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, estado })
  }).then(() => {
    socket.emit('actualizarMesa', { id, estado });
  });
}
socket.on('mesaActualizada', data => {
  alert('Mesa actualizada: ' + JSON.stringify(data));
});
