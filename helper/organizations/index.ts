export function generateOrganizationId(domain?: string | null): string {
  if (!domain) {
    return Math.random().toString(36).substring(2, 8);
  }
  // Extract main part of the domain (ignore subdomains and TLDs)
  const parts = domain.split('.');
  const orgName = parts.length > 2 ? parts[parts.length - 2] : parts[0];

  // Get last two digits of current year
  const year = new Date().getFullYear().toString().slice(-2);

  // Generate 2 random uppercase letters
  const randomSuffix = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');

  // Final ID: orgName-year-suffix
  return `${orgName}-${year}${randomSuffix}`;
}
