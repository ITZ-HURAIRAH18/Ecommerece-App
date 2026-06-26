# Premium E-Commerce App — Full UI Redesign Prompt
## Stack: React Native Expo + Antigravity + Stitch
### Design Target: Top 1% Mobile Commerce — Zero AI-generated aesthetic

---

## THE PROBLEM WITH CURRENT DESIGN (Do Not Repeat These)

- Categories use emoji icons — REMOVE ALL EMOJIS from the entire app
- Inconsistent padding/margins between sections
- Bottom nav icons look generic and misaligned
- Cards have no visual weight — they feel flat and cheap
- Typography is unstyled — no hierarchy, no personality
- Login/Register looks like a default form
- Colors are arbitrary — no system

---

## DESIGN IDENTITY

**Brand:** Unnamed luxury-casual marketplace. Think the intersection of Zara's restraint and Nike's confidence. Not discount. Not flashy. Considered.

**Audience:** 20–38 year old urban shoppers who notice when spacing is off.

**Visual Direction:** Monochromatic white base with a single punchy orange `#FF5C00` used only where it earns its place. No gradients. No glass. No glow. Typography does the heavy lifting.

---

## DESIGN TOKENS (USE EVERYWHERE, NO EXCEPTIONS)

```typescript
// constants/tokens.ts

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
    textTransform: 'uppercase',
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
    textDecorationLine: 'line-through',
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
```

**Fonts to install:**
```bash
npx expo install expo-font
# Download from fonts.google.com alternatives:
# ClashDisplay (display): https://www.fontshare.com/fonts/clash-display
# GeneralSans (body): https://www.fontshare.com/fonts/general-sans
# Load both in _layout.tsx with useFonts()
```

---

## COMPONENT LIBRARY (Build These First)

### Button
```tsx
// Three variants: primary, secondary, ghost
// Primary — solid orange, white text, orange shadow
// Secondary — white bg, orange border, orange text  
// Ghost — no border, orange text, no shadow

<Button 
  variant="primary"     // 'primary' | 'secondary' | 'ghost'
  size="lg"             // 'sm' | 'md' | 'lg'
  fullWidth
  loading={false}
  onPress={handlePress}
>
  Continue
</Button>

// Specs:
// lg: height 54px, borderRadius 12, fontSize 16 GeneralSans-SemiBold
// md: height 46px, borderRadius 10, fontSize 15
// sm: height 36px, borderRadius 8, fontSize 13
// Loading: ActivityIndicator white centered, text hidden
// Disabled: opacity 0.4
// Press animation: scale(0.97) via Reanimated pressable
```

### Input
```tsx
// Floating label style — label animates up on focus
// No placeholder text — label IS the placeholder initially
// Error state: red border + error text below
// Focus state: orange border

<Input
  label="Email address"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={errors.email}
/>

// Specs:
// Height: 56px
// Background: Colors.gray100
// Border: 1.5px solid Colors.gray300 (default) → Colors.primary (focus) → Colors.error (error)
// Border radius: Radius.md (12px)
// Label: GeneralSans-Regular 13px, animates to top-left corner of input on focus
// No box shadow on input
// Right icon slot (password toggle, clear button)
```

### ProductCard
```tsx
// Two layout modes: grid (2-col) and horizontal (list)
// NO emoji. NO star emoji. Use SVG star icons.

// Grid mode specs:
// Image: full width, height = width * 1.1, borderRadius top 12px
// White card bg, borderRadius 12px, Shadow.card
// Padding: 10px
// Wishlist button: absolute top-right, 32x32 white circle, subtle shadow
// Category label: Colors.label style, orange text, above product name
// Product name: h2 style, max 2 lines
// Price row: price (ClashDisplay) + old price side by side
// Rating: filled star SVG (not emoji) + review count in gray500
// Add to cart: small orange circle button (+) bottom right

// Horizontal mode specs (search results, order history):
// Image: 90x90, borderRadius 10, left side
// Content: right of image, full info
// No add-to-cart button in horizontal mode
```

### CategoryChip (replaces emoji category bubbles)
```tsx
// Text-only chip — no icons, no emoji
// Active: orange bg, white text, borderRadius full
// Inactive: gray100 bg, gray700 text, borderRadius full

<CategoryChip
  label="Electronics"
  active={selectedCat === 'electronics'}
  onPress={() => setSelectedCat('electronics')}
/>

// On Categories SCREEN: use full card (not chip)
// Card: white bg, shadow, 160x80px, borderRadius 12
// Category name: h2, centered, no icon
// On press: subtle scale animation via Reanimated
```

### SectionHeader
```tsx
// Left: section title in h2 style
// Right: "See all" — GeneralSans-Medium 13px, Colors.primary
// No divider line
// Padding: 0 screenH, marginBottom sm

<SectionHeader title="Featured" onSeeAll={() => router.push('/products')} />
```

### BottomNav
```tsx
// 5 tabs: Home, Categories, Search, Cart, Profile
// Active: icon + label in Colors.primary, indicator dot above icon
// Inactive: icon + label in Colors.gray500
// Background: white, top border 1px Colors.gray100
// Height: 64px + safe area bottom
// Icons: use react-native-vector-icons/Feather (clean, thin line style)
//   Home → 'home'
//   Categories → 'grid'  
//   Search → 'search'
//   Cart → 'shopping-bag'
//   Profile → 'user'
// Cart badge: orange circle, white number, positioned top-right of icon
// NO emoji. NO filled chunky icons. Feather only.
```

---

