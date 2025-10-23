# Configuration Email pour BookingApp

## Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Configuration SMTP pour le développement (Mailtrap)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=votre_mailtrap_user
SMTP_PASS=votre_mailtrap_password

# Email d'expéditeur
EMAIL_FROM=noreply@bookingapp.com

# Pour la production (optionnel)
EMAIL_SERVICE=gmail
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_app_password
```

## Configuration Mailtrap (Gratuit)

1. **Créez un compte** sur [mailtrap.io](https://mailtrap.io)
2. **Sélectionnez "Email Testing"** dans le dashboard
3. **Créez une nouvelle inbox**
4. **Copiez les identifiants** SMTP fournis
5. **Ajoutez-les** à votre fichier `.env.local`

## Configuration Gmail (Alternative)

1. **Activez l'authentification à 2 facteurs** sur votre compte Google
2. **Générez un mot de passe d'application** :
   - Allez dans Paramètres Google > Sécurité
   - Mot de passe d'application > Sélectionnez "Mail"
   - Copiez le mot de passe généré
3. **Utilisez ces identifiants** :
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=votre_email@gmail.com
   EMAIL_PASS=votre_mot_de_passe_application
   ```

## Test de l'envoi d'email

Après configuration, testez avec :

```bash
# Redémarrez le serveur de développement
npm run dev

# Créez une nouvelle organisation via /onboarding
# L'email devrait maintenant être envoyé
```

## Debugging

Si l'email n'est toujours pas envoyé :

1. **Vérifiez les logs** dans la console du serveur
2. **Testez la configuration** avec un script simple
3. **Vérifiez les variables d'environnement** avec `console.log(process.env)`
