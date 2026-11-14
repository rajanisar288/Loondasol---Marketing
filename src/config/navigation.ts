export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export const navigationConfig: {
  mainNav: NavItem[];
  legalNav: NavItem[];
  companyNav: NavItem[];
  solutionNav: NavItem[];
} = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Services', href: '/services' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Why Choose Us', href: '/why-choose-us' },
    { title: 'About Us', href: '/about' },
    { title: 'Blog', href: '/blog' },
    { title: 'Contact', href: '/contact' },
  ],
  solutionNav: [
    { title: 'Workforce Operations', href: '/services#workforce' },
    { title: 'Biometric Attendance', href: '/services#attendance' },
    { title: 'Automated Multi-Region Payroll', href: '/services#payroll' },
    { title: 'Enterprise AI Co-Pilot', href: '/services#ai' },
    { title: 'Role & Permission Governance', href: '/services#security' },
  ],
  companyNav: [
    { title: 'About Loondasol', href: '/about' },
    { title: 'Why Choose Us', href: '/why-choose-us' },
    { title: 'Pricing & Plans', href: '/pricing' },
    { title: 'Engineering Blog', href: '/blog' },
    { title: 'Contact Sales', href: '/contact' },
  ],
  legalNav: [
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Terms of Service', href: '/terms' },
    { title: 'Security & Compliance', href: '/why-choose-us#security' },
  ],
};
