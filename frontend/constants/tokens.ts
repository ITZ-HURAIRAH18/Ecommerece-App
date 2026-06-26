export const Colors = {
  primary:      '#FF5C00',   // Orange — CTAs only
  primaryLight: '#FFF0E8',   // Orange tint — active tab bg, badge bg
  black:        '#0A0A0A',   // True black — primary text
  gray900:      '#1A1A1A',   // Section headers
  gray700:      '#404040',   // Secondary text
  gray500:      '#737373',   // Placeholder, labels
  gray300:      '#C4C4C4',   // Borders, dividers
  gray100:      '#F5F5F5',   // Card backgrounds, input fills
  white:        '#FFFFFF',   // Page background
  success:      '#16A34A',
  error:        '#DC2626',
  overlay:      'rgba(10,10,10,0.45)',
};

export const Typography = {
  // Display — used for hero text, price display
  display: {
    fontFamily: 'ClashDisplay-Semibold',  // Primary display font
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: Colors.black,
  },
  // Heading — screen titles, product names
  h1: {
    fontFamily: 'ClashDisplay-Medium',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: Colors.black,
  },
  h2: {
    fontFamily: 'ClashDisplay-Medium',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: Colors.black,
  },
  // Body — product descriptions, metadata
  body: {
    fontFamily: 'GeneralSans-Regular',    // Body workhorse
    fontSize: 15,
    lineHeight: 22,
    color: Colors.gray700,
  },
  bodyMedium: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.black,
  },
  small: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray500,
  },
  label: {
    fontFamily: 'GeneralSans-Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
    color: Colors.gray500,
  },
  // Price — always ClashDisplay
  price: {
    fontFamily: 'ClashDisplay-Semibold',
    fontSize: 20,
    lineHeight: 26,
    color: Colors.black,
  },
  priceOld: {
    fontFamily: 'GeneralSans-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray500,
    textDecorationLine: 'line-through' as const,
  },
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
  screenH: 20,  // Horizontal screen padding — consistent everywhere
};

export const Radius = {
  sm:   6,
  md:  12,
  lg:  16,
  xl:  24,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#FF5C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};
