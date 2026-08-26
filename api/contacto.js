export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            ok: false,
            mensaje: 'Método no permitido'
        });
    }

    const { nombre, email, mensaje } = req.body || {};

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Faltan campos obligatorios'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El email no es válido'
        });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error('Falta la variable de entorno RESEND_API_KEY');
        return res.status(500).json({
            ok: false,
            mensaje: 'El servicio de correo no está configurado.'
        });
    }

    const respuesta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'ForensicLex <contacto@forensiclex.com>',
            to: ['contacto@forensiclex.com'],
            reply_to: email,
            subject: `Nuevo mensaje de contacto de ${nombre}`,
            text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
        })
    });

    if (!respuesta.ok) {
        console.error('Error de Resend:', await respuesta.text());
        return res.status(502).json({
            ok: false,
            mensaje: 'No se pudo enviar el mensaje. Inténtalo de nuevo.'
        });
    }

    return res.status(200).json({
        ok: true,
        mensaje: '¡Mensaje enviado correctamente!'
    });
}
