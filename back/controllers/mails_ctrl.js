require("dotenv").config();
const pool = require("../connection/sqlConnection");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require('fs').promises;

exports.sendMail = async (req, res, next) => {

  try {

    const { name, prenom, email, phone, subject, message, items_uuid } = req.body;
    const fileName = req.file ? req.file.filename : null;

    // 1. Création du transporteur
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    // 2. Définition de l'email à envoyer
    const mailOptions = {
      from: `"${prenom} ${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || "Nouveau message depuis le formulaire",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden;">
          
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/send-mass-email.png" alt="Message icon" style="max-height: 40px; vertical-align: middle;" />
            <h2 style="margin: 10px 0 0;">Nouveau message du site Marchantiq</h2>
          </div>
          
          <div style="padding: 20px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="https://img.icons8.com/ios-filled/50/000000/user.png" style="width: 24px; margin-right: 10px;" />
              <div><strong>Nom :</strong> ${name}</div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="https://img.icons8.com/ios-filled/50/000000/name.png" style="width: 24px; margin-right: 10px;" />
              <div><strong>Prénom :</strong> ${prenom}</div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="https://img.icons8.com/ios-filled/50/000000/new-post.png" style="width: 24px; margin-right: 10px;" />
              <div><strong>Email :</strong> ${email}</div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="https://img.icons8.com/ios-filled/50/000000/phone.png" style="width: 24px; margin-right: 10px;" />
              <div><strong>Téléphone :</strong> ${phone}</div>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <img src="https://img.icons8.com/ios-filled/50/000000/qr-code.png" style="width: 24px; margin-right: 10px;" />
              <div><strong>N° de l'objet :</strong> ${items_uuid ? items_uuid : "Non renseigné"}</div>
            </div>
            <div style="margin-top: 15px; padding: 15px; background-color: #f1f1f1; border-left: 4px solid #4CAF50; white-space: pre-wrap;">
              ${message.replace(/\n/g, "<br/>")}
            </div>
          </div>
        </div>
      </div>
      `,
      attachments: [
        {
          filename: fileName,
          path: path.join(__dirname, "../uploads/pictures/items", fileName)
        }
      ]
    };

    // 3. Envoi de l'email
    const info = await transporter.sendMail(mailOptions);

    // supression de l'image 
    try {
      await fs.unlink(`uploads/pictures/items/${fileName}`);
    } catch (err) {
      res.status(500).json({ error: err });
    }

    // 4. Réponse au client
    res.status(200).json({ message: "Email envoyé avec succès", info: info.response });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du mail", details: error.message });
  }
};