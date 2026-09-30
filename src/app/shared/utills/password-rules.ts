// Password rules from docs/04-authentication.md: 8+ characters with an
// uppercase letter, a lowercase letter and a number; only @$!%*?& symbols.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/;
