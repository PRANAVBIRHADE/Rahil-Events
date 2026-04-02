export function isTruthyEnv(value: string | undefined): boolean {
  if (!value) return false;

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

export function isRegistrationKillSwitchEnabled(): boolean {
  return isTruthyEnv(process.env.REGISTRATION_KILL_SWITCH);
}

export function getRegistrationKillSwitchMessage(): string {
  return (
    process.env.REGISTRATION_KILL_SWITCH_MESSAGE?.trim() ||
    'Registration is temporarily disabled. Please contact the help desk for assistance.'
  );
}

export function isNotificationEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}

export function isNotificationWhatsappConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM,
  );
}

export function getNotificationCapabilities() {
  return {
    email: isNotificationEmailConfigured(),
    whatsapp: isNotificationWhatsappConfigured(),
  };
}

export function hasAdminSetupKey(): boolean {
  return Boolean(process.env.ADMIN_SETUP_KEY?.trim());
}
