// lib/jurisdictionCheck.js
//
// Lightweight, non-legal-advice heuristic that flags when a role's location
// commonly triggers AI-in-hiring disclosure/audit obligations, so the
// recruiter sees a reminder instead of silence. This is a product nudge,
// not a compliance determination — the copy says so on purpose.
//
// Keep this list short and re-check it periodically; this area of law
// changes often.

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
]

export const EU_EEA_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland',
  'Ireland', 'Italy', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Malta', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania',
  'Slovakia', 'Slovenia', 'Spain', 'Sweden',
]

// Full country list (alphabetical), covering essentially every country a
// job posting would realistically name. Falls back to "Other" for anything
// not listed (a territory, a disputed region, etc.).
export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
  'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia',
  'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica', "Cote d'Ivoire",
  'Croatia', 'Cuba', 'Cyprus', 'Czechia',
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji',
  'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
  'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
  'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe', 'Other',
]

/**
 * @param {Object} location
 * @param {string} location.country
 * @param {string} [location.state]        - only meaningful when country === 'United States'
 * @param {boolean} [location.isNYC]        - only asked when state === 'New York'
 * @returns {{ level: 'info'|'warning', message: string } | null}
 *   null when nothing to flag for the given location.
 */
export function getJurisdictionNotice({ country, state, isNYC } = {}) {
  if (!country) return null

  if (country === 'United States') {
    if (state === 'New York' && isNYC) {
      return {
        level: 'warning',
        message:
          "This role is in New York City. NYC Local Law 144 generally requires employers using an automated tool like this in hiring to (1) get an independent annual bias audit of the tool and (2) notify candidates at least 10 business days before it's used on them. That notice and audit obligation is the employer's/recruiter's responsibility, not Resemy's — make sure it's been handled for this role.",
      }
    }
    if (state === 'Illinois') {
      return {
        level: 'warning',
        message:
          "This role is in Illinois. Illinois law requires notifying candidates when AI is used to help evaluate them, and (as of Jan 1, 2026) restricts using AI in ways that produce a discriminatory effect in employment decisions. Make sure candidates have been notified.",
      }
    }
    if (state === 'Colorado') {
      return {
        level: 'info',
        message:
          "This role is in Colorado. Colorado's AI Act (covering high-risk uses like hiring) has had its effective date delayed and is currently being revised — worth checking its current status before relying on it being (or not being) in force.",
      }
    }
    return null
  }

  if (EU_EEA_COUNTRIES.includes(country)) {
    return {
      level: 'warning',
      message:
        "This role is in the EU/EEA. The EU AI Act classifies hiring-evaluation tools like this as high-risk. Some obligations (like informing candidates AI is being used) already apply now, even though the main compliance deadline for high-risk systems has been pushed to December 2027. Make sure candidates have been informed.",
    }
  }

  return null
}