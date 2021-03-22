const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/sockets');

// Mensajes de socket
io.on('connection', client => {
    console.log('Cliente conectado.');

    const [ valido, uid ] = comprobarJWT(client.handshake.headers['x-token'])

    // Verificar autenticacion
    if(!valido){ return client.disconnect();}
    
    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    // Sala global, client.id, 
    client.join(uid);

    // Escuchar mensaje personal
    client.on('mensaje-personal', async (payload) => {
        // TODO: grabar mensaje
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    })


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });
});