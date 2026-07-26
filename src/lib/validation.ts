/**
 * Creato4 Lab — Shared Validation Utilities
 * ==========================================
 * Input validation for server actions and forms.
 * Prevents injection, ensures data integrity, and provides consistent error messages.
 */

/** Sanitize a string by trimming whitespace and removing dangerous characters */
export function sanitizeString(input: string, maxLength = 500): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Strip HTML angle brackets
}

/** Validate an Indian phone number (10 digits, optionally with +91 prefix) */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Validate a name (2-100 chars, letters and spaces only) */
export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100 && /^[\p{L}\p{M}\s'.,-]+$/u.test(trimmed);
}

/** Validate a general text message (1-5000 chars) */
export function isValidMessage(message: string, maxLength = 5000): boolean {
  const trimmed = message.trim();
  return trimmed.length >= 1 && trimmed.length <= maxLength;
}

/** Validate consultation ticket input */
export function validateConsultationInput(data: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || !isValidName(data.name)) {
    errors.push('Please enter a valid name (2-100 characters).');
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('Please enter a valid Indian phone number (10 digits).');
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Please enter a valid email address.');
  }

  if (data.subject && !isValidMessage(data.subject, 200)) {
    errors.push('Subject must be between 1-200 characters.');
  }

  if (data.message && !isValidMessage(data.message, 5000)) {
    errors.push('Message must be between 1-5000 characters.');
  }

  return { valid: errors.length === 0, errors };
}

/** Validate product creation input */
export function validateProductInput(data: {
  title?: string;
  description?: string;
  shortDescription?: string;
  price?: number | string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Product title must be at least 3 characters.');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.');
  }

  if (!data.shortDescription || data.shortDescription.trim().length < 10) {
    errors.push('Short description must be at least 10 characters.');
  }

  const price = Number(data.price);
  if (isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number.');
  }

  return { valid: errors.length === 0, errors };
}
