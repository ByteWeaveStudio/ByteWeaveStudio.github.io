/**
 * The two legal documents, ported verbatim from the static site
 * (Website/privacy-policy.html and Website/terms-and-conditions.html).
 *
 * The footer and the contact form have always linked to /privacy-policy and
 * /terms-and-conditions; until these pages existed those were 404s on every
 * page of the site.
 *
 * The wording is unchanged on purpose. `effective` carries the original
 * date from the old page rather than today's — moving the date on a legal
 * document is a statement about the owner's review process, not a content
 * edit, so it needs their sign-off.
 */

export type LegalBlock = { text?: string; list?: string[] }

export type LegalSection = {
  heading: string
  blocks: LegalBlock[]
}

export type LegalDoc = {
  slug: string
  title: string
  eyebrow: string
  /** Short summary; also the meta description. */
  lead: string
  effective?: string
  effectiveLabel?: string
  intro: string
  sections: LegalSection[]
}

export const privacyPolicy: LegalDoc = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  eyebrow: 'Legal',
  lead: 'What ByteWeave Studio collects when you visit the site or contact us, how it is used, how long it is kept, and the rights you have over it.',
  effective: '2025-01-18',
  effectiveLabel: '18 January 2025',
  intro:
    'ByteWeave.studio (“ByteWeave”, “we”, “our”, or “us”) values your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect information when you visit our website or interact with us.',
  sections: [
    {
      heading: 'Information we collect',
      blocks: [
        { text: 'Information you provide:' },
        {
          list: [
            'Name',
            'Email address',
            'Company name',
            'Any information you submit through contact forms or direct communication',
          ],
        },
        { text: 'Automatically collected information, when you visit our website:' },
        {
          list: [
            'IP address',
            'Browser type and version',
            'Device information',
            'Pages visited and time spent on the site',
            'Referring URLs',
          ],
        },
        {
          text: 'This data is collected using cookies or similar technologies to improve website performance and user experience.',
        },
      ],
    },
    {
      heading: 'How we use your information',
      blocks: [
        { text: 'We use collected information to:' },
        {
          list: [
            'Respond to inquiries and contact requests',
            'Communicate about our services',
            'Improve website functionality and content',
            'Analyze website usage and performance',
            'Maintain website security',
          ],
        },
        { text: 'We do not sell, rent, or trade your personal information.' },
      ],
    },
    {
      heading: 'Cookies and tracking technologies',
      blocks: [
        { text: 'Our website may use cookies or similar tracking technologies to:' },
        {
          list: [
            'Understand how visitors use the site',
            'Improve performance and usability',
            'Enable basic analytics',
          ],
        },
        {
          text: 'You can control or disable cookies through your browser settings. Disabling cookies may affect certain features of the website.',
        },
      ],
    },
    {
      heading: 'Data sharing and third parties',
      blocks: [
        {
          text: 'We may share limited information with trusted third-party service providers for:',
        },
        { list: ['Website hosting', 'Analytics', 'Infrastructure and security'] },
        {
          text: 'These providers are authorized to use your information only as necessary to perform services on our behalf and are required to protect it.',
        },
      ],
    },
    {
      heading: 'Data security',
      blocks: [
        {
          text: 'We take reasonable technical and organizational measures to protect your information against:',
        },
        { list: ['Unauthorized access', 'Loss', 'Misuse', 'Disclosure'] },
        {
          text: 'However, no method of transmission over the internet or electronic storage is completely secure.',
        },
      ],
    },
    {
      heading: 'Data retention',
      blocks: [
        { text: 'We retain personal information only for as long as necessary to:' },
        {
          list: [
            'Fulfill the purposes outlined in this policy',
            'Comply with legal or operational requirements',
          ],
        },
      ],
    },
    {
      heading: 'Your rights',
      blocks: [
        { text: 'Depending on your location, you may have the right to:' },
        {
          list: [
            'Request access to your personal data',
            'Request correction or deletion of your data',
            'Withdraw consent for data processing',
          ],
        },
        {
          text: 'You can exercise these rights by contacting us at the email address below.',
        },
      ],
    },
    {
      heading: 'External links',
      blocks: [
        {
          text: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.',
        },
      ],
    },
    {
      heading: 'Changes to this policy',
      blocks: [
        {
          text: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.',
        },
      ],
    },
  ],
}

export const termsAndConditions: LegalDoc = {
  slug: 'terms-and-conditions',
  title: 'Terms & Conditions',
  eyebrow: 'Legal',
  lead: 'The terms that govern use of the ByteWeave Studio website: acceptable use, intellectual property, disclaimers, liability and governing law.',
  intro:
    'These Terms and Conditions (“Terms”) govern your use of the ByteWeave.studio website (“Website”), operated by ByteWeave.studio (“ByteWeave”, “we”, “our”, or “us”). By accessing the website and using our services, you agree to be bound by these Terms.',
  sections: [
    {
      heading: 'Use of the website',
      blocks: [
        { text: 'You may use this Website for lawful purposes only. You agree not to:' },
        {
          list: [
            'Use the Website in any way that violates applicable laws or regulations',
            'Attempt to gain unauthorized access to any part of the Website',
            'Interfere with the security or functionality of the Website',
            'Use the Website to transmit harmful or malicious code',
          ],
        },
      ],
    },
    {
      heading: 'Intellectual property',
      blocks: [
        {
          text: 'All content on this Website, including but not limited to text, graphics, logos, images, code, and design elements, is the property of ByteWeave.studio or its licensors and is protected by intellectual property laws.',
        },
        {
          text: 'You may not copy, reproduce, distribute, modify, or create derivative works from any content on this Website without prior written permission from ByteWeave.studio.',
        },
      ],
    },
    {
      heading: 'Services and information disclaimer',
      blocks: [
        {
          text: 'The information provided on this Website is for general informational purposes only and does not constitute professional, technical, or legal advice.',
        },
        {
          text: 'Descriptions of services, technologies, or case studies are illustrative and do not guarantee specific outcomes or results. Any services offered by ByteWeave.studio are subject to separate agreements and terms.',
        },
      ],
    },
    {
      heading: 'Third-party links',
      blocks: [
        {
          text: 'This Website may contain links to third-party websites or services. ByteWeave.studio is not responsible for the content, accuracy, or privacy practices of any third-party websites.',
        },
        { text: 'Accessing third-party links is at your own risk.' },
      ],
    },
    {
      heading: 'Limitation of liability',
      blocks: [
        {
          text: 'To the fullest extent permitted by law, ByteWeave.studio shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with:',
        },
        {
          list: [
            'Your use or inability to use the Website',
            'Errors or omissions in Website content',
            'Any unauthorized access to or use of our systems',
          ],
        },
      ],
    },
    {
      heading: 'Indemnification',
      blocks: [
        {
          text: 'You agree to indemnify and hold harmless ByteWeave.studio and its affiliates from any claims, damages, liabilities, losses, or expenses arising out of:',
        },
        {
          list: [
            'Your use of the Website',
            'Your violation of these Terms',
            'Your infringement of any third-party rights',
          ],
        },
      ],
    },
    {
      heading: 'Availability and changes',
      blocks: [
        { text: 'We reserve the right to:' },
        {
          list: [
            'Modify, suspend, or discontinue the Website at any time without notice',
            'Update or change these Terms at our discretion',
          ],
        },
        {
          text: 'Continued use of the Website after changes are posted constitutes acceptance of the updated Terms.',
        },
      ],
    },
    {
      heading: 'Governing law',
      blocks: [
        {
          text: 'These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.',
        },
      ],
    },
  ],
}

export const legalDocs = [privacyPolicy, termsAndConditions]
