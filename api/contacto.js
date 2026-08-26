import nodemailer from 'nodemailer';

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

    const requiredSettings = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    if (requiredSettings.some(setting => !process.env[setting])) {
        console.error('Faltan variables de entorno SMTP');
        return res.status(500).json({
            ok: false,
            mensaje: 'El servicio de correo no está configurado.'
        });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: 'contacto@forensiclex.com',
            replyTo: email,
            subject: `Nuevo mensaje de contacto de ${nombre}`,
            text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
        });
    } catch (error) {
        console.error('Error SMTP:', error);
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
