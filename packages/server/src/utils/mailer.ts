import { MAILER_HOST, MAILER_PASS, MAILER_PORT, MAILER_SECURE, MAILER_USER } from '@/config'
import { server } from '@/main';
import { SendMailOptions, createTransport, getTestMessageUrl } from 'nodemailer'


const transporter = createTransport({
    host: MAILER_HOST,
    port: +MAILER_PORT,
    secure: false,
    auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
    },
});

export class Mailer {

    public static async sendEmail(payload: SendMailOptions) {
        transporter.sendMail(payload, (err, info) => {
            if (err) {
                server.log.error("🚀 ~ Mailer::sendMail ~ err:", err)
                return;
            }
            server.log.info("===============================================================")
            server.log.info("Preview URL: %s", getTestMessageUrl(info))
            server.log.info("===============================================================")
        })
    }
}