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

## SCREEN DESIGNS

---

### SCREEN 1 — Splash / Onboarding

```
Full screen white background.
Center: Brand wordmark in ClashDisplay-Semibold 40px, Colors.black
Subtext: "Shop without compromise" GeneralSans-Regular 16px, gray500
Below: thin horizontal line (1px, gray300) 40px wide centered — brand signature element

Animation on mount:
- Wordmark fades in from y+20 over 600ms
- Subtext fades in delayed 200ms
- Line draws left to right over 800ms
```

---

### SCREEN 2 — Login

```
Layout: ScrollView, paddingHorizontal: screenH (20px)

TOP SECTION (40% of screen):
- Back button top left (Feather chevron-left)
- Large heading: "Welcome back." — ClashDisplay-Semibold 32px, black
  (note the period — intentional, adds personality)
- Subtext: "Sign in to continue shopping" — GeneralSans 15px, gray500
- 24px gap below

FORM SECTION:
- Email Input (floating label)
- 16px gap
- Password Input (floating label + show/hide toggle)
- 8px gap
- "Forgot password?" right-aligned, GeneralSans-Medium 13px, Colors.primary
- 32px gap
- Primary Button fullWidth: "Sign in"
- 24px gap
- Divider: thin line both sides + "or" center in gray500 GeneralSans 13px
- 24px gap
- Secondary Button fullWidth: Google icon (SVG, not emoji) + "Continue with Google"
- 24px gap

BOTTOM:
- "Don't have an account? " gray700 + "Create one" primary — GeneralSans 14px, centered

DESIGN NOTES:
- No card/container wrapping the form — inputs sit directly on white bg
- No illustration, no logo repeated, no background decoration
- The typography IS the design — trust it
```

---

### SCREEN 3 — Register

```
Same layout structure as Login.

Heading: "Create account."
Subtext: "Join thousands of smart shoppers"

Fields in order:
1. Full name
2. Email address
3. Password
4. Confirm password (only show after password is filled — reduces cognitive load)

Below password: 
Password strength bar — 4 segments, fills orange as strength increases
Labels: Weak / Fair / Strong / Very strong in GeneralSans 12px

Primary Button: "Create account"
Bottom link: "Already have an account? Sign in"

OTP Screen (after register):
- Heading: "Check your inbox."
- Subtext: "We sent a 6-digit code to {email}"
- 6 individual Input boxes in a row (each 48x56px, gray100 bg, orange border on focus)
- Auto-advance focus on each digit entry
- "Resend code" — gray500, becomes orange + clickable after 60s countdown
- Primary Button: "Verify"
```

---

### SCREEN 4 — Home

```
HEADER (not a navigation header — custom):
paddingHorizontal: 20, paddingTop: safe area top + 12, paddingBottom: 16

Left column:
  "Good morning," — GeneralSans-Regular 13px, gray500, label style
  "Muhammad" — ClashDisplay-Medium 22px, black (use first name from auth store)
Right: notification bell icon (Feather 'bell') — gray900, 24px
  If unread: small orange dot top-right of bell

────────────────────────────────────────────────

HERO BANNER (auto-scroll carousel):
- marginHorizontal: 20
- Height: screen width * 0.5 (aspect ratio 2:1)
- borderRadius: 16
- Each slide: full image (from DB — admin uploaded), overlay gradient bottom third
- Overlay text: sale label in label style + headline in h1 style, white
- Pagination: 3-4 dots bottom center, active dot is orange (wider, pill shape), inactive gray300
- Auto-scroll every 4s, manual swipe
- NO TEXT ON TOP OF IMAGES unless overlay gradient is present

────────────────────────────────────────────────

CATEGORIES ROW:
SectionHeader: "Categories" + "See all"
Horizontal ScrollView, no scrollbar, paddingHorizontal: 20, gap: 10

CategoryChip — text only, pill style (see component spec above)
Show 6-8 chips. First chip "All" is default selected.
Chips: All / Electronics / Fashion / Home / Beauty / Sports / Books

────────────────────────────────────────────────

FEATURED PRODUCTS:
SectionHeader: "Featured"
2-column FlatList, numColumns: 2
paddingHorizontal: 20, columnWrapperStyle: { gap: 12 }, itemGap: 12
Use ProductCard grid mode

────────────────────────────────────────────────

NEW ARRIVALS:
SectionHeader: "New arrivals"
Horizontal FlatList, ProductCard grid mode, paddingHorizontal: 20, gap: 12
Card width: screen width * 0.44

────────────────────────────────────────────────

FLASH SALE (only show if admin has configured active sale):
Background: Colors.black
Padding: 20
Left: "Flash Sale" in ClashDisplay-Semibold white + countdown timer
  Timer: HH:MM:SS in orange monospace-style (ClashDisplay)
Below: horizontal scroll of discounted ProductCards

────────────────────────────────────────────────

DESIGN RULES FOR HOME:
- Every section has exactly 24px margin-top from previous section
- Section header always 16px margin-bottom to its content
- No floating action button on home
- Pull to refresh: default spinner, orange tint color
```

---

### SCREEN 5 — Categories

```
HEADER:
- Screen title: "Categories" — ClashDisplay-Medium 24px, paddingHorizontal: 20

GRID LAYOUT:
- 2-column grid, gap: 12px, paddingHorizontal: 20
- Each card: white bg, Shadow.card, borderRadius: 16, height: 90px
- Layout: horizontal — left side colored accent bar (4px wide, full height, orange) 
  then category name in h2 style centered vertically
- NO ICONS. NO EMOJI. Name only.
- Active/pressed: scale 0.97, very subtle

Alternatively (if admin has uploaded category images):
- Full-bleed image background with dark overlay
- White category name centered
- Same card dimensions

On tap: navigate to /search?category={_id}
```

---

### SCREEN 6 — Search

```
SEARCH INPUT:
Sticky at top, paddingHorizontal: 20, paddingVertical: 12, white bg
Input: height 48, borderRadius full (999), gray100 bg, Feather 'search' icon left
Typing: debounce 300ms → call /api/search/suggestions
Right: 'x' clear button appears when text present

DEFAULT STATE (no query):
- Label style header: "Recent searches"
- List of recent searches (stored locally) with Feather 'clock' icon left
  and Feather 'x' right to remove
- Below: Label header "Trending"
- Horizontal chips of trending search terms (from API)

RESULTS STATE:
- Results count: "124 results for 'sneakers'" — GeneralSans 13px, gray500
- Filter/Sort bar: horizontal row of chips
  "Filter" (Feather 'sliders') + "Price" + "Rating" + "In Stock"
  Active filter chip: orange bg, white text
- FlatList of ProductCard in horizontal mode (full width per item)
- Each card: image left 90x90, right: category label / name / price / rating

FILTER BOTTOM SHEET (on "Filter" tap):
Using @gorhom/bottom-sheet — snapPoints: ['60%', '90%']
Sections:
  Category — horizontal scrollable chips
  Price Range — custom range slider (two handles, orange track)
  Rating — 5 star selectors (tap to select minimum)
  Brand — text chips
  In Stock — toggle switch
Bottom: two buttons — "Reset" (ghost) + "Apply" (primary)
```

---

### SCREEN 7 — Product Detail

```
LAYOUT: Full screen ScrollView + sticky bottom bar

IMAGE GALLERY:
Height: screenWidth (1:1 square)
Horizontal paging ScrollView — each image fills full width and height
Pagination dots: bottom center, same style as hero banner
Long-press: haptic feedback
NO pinch-zoom unless you implement react-native-zoom-image properly

CONTENT AREA (scroll continues below image):
paddingHorizontal: 20

Category label — label style, orange, 16px above product name
Product name — h1 style, max 3 lines
16px below

Price row:
  Left: current price (Typography.price) + old price (Typography.priceOld) if discounted
  Right: discount badge if > 0 — orange bg, white text "−20%" in GeneralSans-Medium 12px

12px below
Rating row: SVG star icons (filled orange / gray) + "4.8" bold + "(312 reviews)" gray500

24px below
VARIANTS SECTION:
Label: "Size" or "Color" in label style
Option chips: same as CategoryChip — active orange / inactive gray100
Chips render from product.variants array

24px below
DESCRIPTION:
Label: "About this item"
Body text, max 4 lines by default
"Read more" — orange text, toggles full description

24px below
SPECIFICATIONS:
Accordion — tap to expand/collapse
Table-style rows: key gray500 left, value black right, 1px gray100 divider between rows

24px below
REVIEWS SECTION:
Rating summary bar (1–5 stars) with fill percentage bars in orange
3 review cards — author initial avatar + name + date + star rating + review body
"See all X reviews" button (ghost style)

STICKY BOTTOM BAR:
Position absolute, bottom 0, white bg, top border 1px gray100
Safe area padding bottom
Height 80px (+ safe area)
Left: wishlist button — white bg, gray300 border, Feather 'heart' icon, 54px square, borderRadius 12
Right: Primary Button "Add to cart" — flex 1, marginLeft 12
If item in cart: button text changes to "Go to cart" with orange ghost style
```

---

### SCREEN 8 — Cart

```
HEADER:
"Cart" ClashDisplay-Medium 24px left + item count badge right

EMPTY STATE:
Center of screen
SVG illustration — simple line art shopping bag (no emoji)
"Your cart is empty" h2 style
"Start adding items you love" body gray500
Primary button "Explore products" 

ITEMS LIST:
FlatList, paddingHorizontal 20
Each CartItem card:
  White bg, shadow.card, borderRadius 12, marginBottom 12
  padding: 12
  Left: product image 80x80, borderRadius 10
  Right content:
    Category label (label style, orange)
    Product name (bodyMedium)
    Selected variant (small, gray500) if applicable
    Bottom row:
      Left: price (Typography.price, orange)
      Right: quantity stepper — minus (Feather 'minus') / count / plus (Feather 'plus')
        Stepper: 3 elements in a row, each 32x32, borderRadius 8, gray100 bg
        Active buttons: black bg, white icon
  Top-right: Feather 'x' remove button, 24x24, gray500

  Swipe left gesture to reveal delete (red bg, white trash icon) — secondary UX

COUPON ROW:
Below list, paddingHorizontal 20
Row with Input (placeholder "Coupon code") + "Apply" ghost button
If applied: green success state, savings shown

ORDER SUMMARY CARD:
White bg, shadow.card, borderRadius 16, marginHorizontal 20, padding 20
Rows: Subtotal / Shipping / Discount / ─── divider / Total
Total row: ClashDisplay-Semibold, larger font
Primary Button "Proceed to checkout" fullWidth below card
```

---

### SCREEN 9 — Checkout (3 Steps)

```
STEP INDICATOR at top:
3 circles connected by lines: "Address" → "Payment" → "Review"
Active: orange filled circle + orange label
Complete: checkmark in orange circle
Inactive: gray300 circle

STEP 1 — Address:
Section: "Saved addresses"
Address cards — radio select style, white bg shadow card, borderRadius 12
  Name / street / city / country in body style
  Active: orange border 1.5px
"+ Add new address" — ghost button with Feather 'plus'
Address form: Name, Street, City, State, ZIP, Country (floating label inputs)
CTA: "Continue to payment" Primary Button

STEP 2 — Payment:
Radio options in cards (same style as address):
  Cash on Delivery — icon: Feather 'dollar-sign'
  Credit / Debit Card — icon: Feather 'credit-card'
  Wallet — icon: Feather 'smartphone'
Card form (only appears if card selected):
  Card number input (auto-formats 1234 5678 ...)
  Row: Expiry + CVV inputs side by side

STEP 3 — Review:
Read-only summary of items, address, payment
Total in large ClashDisplay
CTA: "Place order" Primary Button (orange shadow style)

SUCCESS SCREEN:
White screen, center content
Checkmark animation (Lottie or simple Reanimated circle draw)
"Order placed!" ClashDisplay-Semibold 28px
"ORD-XXXXXXXX" in label style, orange, monospace
"Estimated delivery: {date}" body gray500
Two buttons stacked: "Track order" (primary) + "Continue shopping" (ghost)
```

---

### SCREEN 10 — Order History + Order Detail

```
ORDER HISTORY:
Header: "My orders"
Filter chips: All / Active / Delivered / Cancelled
FlatList of OrderCards:
  White bg, shadow, borderRadius 12, padding 16
  Top row: "ORD-XXXXXXXX" in label orange + status badge right
    Status badge: pill shape, color-coded:
      Placed → gray100/gray700
      Shipped → blue tint
      Delivered → green tint
      Cancelled → red tint
  Product thumbnails row: max 3 small 48x48 images + "+N more" if more
  Bottom row: total price (price style) + date (small gray500) + "View" ghost button

ORDER DETAIL:
Full real-time data from API (no hardcoded dates ever)
  
Timeline section:
  Vertical line on left (2px orange)
  Each status node: orange filled circle on line + status name (bodyMedium) + date/time (small gray500)
  Pending future steps: gray300 circle + gray300 line
  
Items section: horizontal list of product images + names + quantities
Address section: card style
Payment summary: same as cart summary style
```

---

### SCREEN 11 — Profile

```
HEADER SECTION:
paddingHorizontal 20, paddingTop safe area + 16, paddingBottom 24
Avatar: 72x72 circle, initials if no photo, orange bg with white ClashDisplay initial
  Tap: image picker to upload
Name: ClashDisplay-Medium 20px below avatar
Email: GeneralSans 14px gray500

STATS ROW:
3 columns, equal width, gray100 bg borderRadius 16, padding 16 total
Each: count in ClashDisplay-Semibold 22px + label in small gray500
  Orders | Wishlist | Reviews

MENU SECTIONS:
Each section has a label header above (label style, gray500)
Menu items: white bg, full width, paddingHorizontal 20 paddingVertical 16
  Left: Feather icon (gray700, 20px) + label (bodyMedium) 
  Right: Feather 'chevron-right' (gray300, 18px)
  Bottom border: 1px gray100 (except last item in group)

Section 1 — Account:
  My Orders / My Wishlist / Address Book / Payment Methods

Section 2 — Settings:
  Notifications / Privacy & Security / App Preferences

Section 3 — Support:
  Help Center / Contact Support / Rate App

LOGOUT:
Below all sections, paddingHorizontal 20
Ghost button, fullWidth, error color text "Log out"
Small "v2.1.0" version text centered below in gray300 12px
```

---

### SCREEN 12 — Wishlist

```
Header: "Wishlist" + item count

Empty state same pattern as cart empty state (different copy):
  "Nothing saved yet"
  "Tap the heart on any product to save it here"

Grid: same as home featured — 2 column ProductCard grid
Wishlist toggle on each card: filled heart = wishlisted (orange)
Empty heart = not wishlisted (gray300)
```

---

### SCREEN 13 — Notifications

```
Header: "Notifications" + "Mark all read" right (orange, small, only if unread exist)

Group by: Today / Yesterday / Earlier

Each notification item:
  Left: 44x44 circle bg matching notification type
    Order update → orange bg, Feather 'package'
    Price drop → green bg, Feather 'tag'
    Promo → gray bg, Feather 'percent'
  Content: 
    Title bodyMedium
    Body small gray500
    Time small gray300 bottom right
  Unread: thin orange left border (3px)
  Read: no border, slightly muted bg (gray100)
  Tap: navigate to relevant screen
```

---

## ADMIN PANEL SCREENS

```
Accessible only when user.role === 'admin'
Navigate via Profile → "Admin Dashboard" (only visible to admins)

ADMIN NAV (replace bottom nav for admin):
Dashboard / Products / Categories / Orders / Banners / Users

DASHBOARD:
Stats cards row: Total Revenue / Orders Today / New Users / Active Products
Each card: white bg shadow, ClashDisplay number, label below, small trend indicator

PRODUCT MANAGEMENT (/admin/products):
  Header: "Products" + "Add product" primary button
  FlatList of admin product rows:
    Thumbnail 56x56 + name + price + stock count + status toggle
    Swipe right: edit | delete actions
  
  ADD/EDIT PRODUCT FORM:
    All floating label inputs (see Input component)
    Image upload: multi-image picker, drag-to-reorder, delete X on each
    Category: BottomSheet picker (not dropdown)
    Price + Discount Price: side by side
    Stock, Brand, SKU: inputs
    Variants: add rows dynamically (Name + Options)
    Tags: chip input (type + press comma/enter)
    Save button: sticky at bottom

CATEGORY MANAGEMENT (/admin/categories):
  List of categories with name + product count
  Add: Name + Image upload (optional) + color accent (color picker)
  
BANNER MANAGEMENT (/admin/banners):
  Drag-to-reorder list of active banners
  Each: image thumbnail + title + linked URL + toggle active/inactive
  "Add banner" → image upload + title + CTA text

ORDER MANAGEMENT (/admin/orders):
  Filter tabs: All / Pending / Active / Delivered
  Each order row: order number + customer name + total + date + status dropdown
  Status dropdown: Picker from '@react-native-picker/picker'
  Tap row: full order detail

USER MANAGEMENT (/admin/users):
  List: avatar initial + name + email + joined date + order count
  Tap: user profile read-only view
```

---

## STITCH IMPLEMENTATION NOTES

When implementing with Stitch (Expo's design-to-code tool) or a similar figma-to-code pipeline:

1. Create Figma components matching EVERY token above first — do not start coding until tokens are in Figma
2. Use Auto Layout for all components — no fixed positions
3. Component naming in Figma must match component names above exactly (Button/primary, Input/default, ProductCard/grid etc)
4. Export design tokens as JSON before generating code
5. All component variants defined in Figma before export

---

## ANTIGRAVITY IMPLEMENTATION NOTES

Antigravity handles the animation layer. Apply these:

```typescript
// 1. Screen entry animation — every screen
// Fade + slide up on mount
const screenAnim = useSharedValue(0);
useEffect(() => {
  screenAnim.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
}, []);
const screenStyle = useAnimatedStyle(() => ({
  opacity: screenAnim.value,
  transform: [{ translateY: interpolate(screenAnim.value, [0, 1], [16, 0]) }],
}));

// 2. Button press animation — ALL buttons
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
const onPressIn = () => { scale.value = withSpring(0.96, { damping: 15 }); };
const onPressOut = () => { scale.value = withSpring(1, { damping: 12 }); };

// 3. ProductCard wishlist heart animation
const heartScale = useSharedValue(1);
const toggleWishlist = () => {
  heartScale.value = withSequence(
    withSpring(1.4, { damping: 8 }),
    withSpring(1, { damping: 10 })
  );
};

// 4. Category chip selection
// Active chip slides orange background behind it (layout animation)

// 5. Cart item removal
// Slide out right + height collapse to 0 with LayoutAnimation

// 6. Bottom sheet (filter panel)
// @gorhom/bottom-sheet handles this — override handle style to match design tokens

// DO NOT add animation to:
// - Text rendering
// - Image loads (use expo-image blurhash only)
// - List scroll (let RN handle it)
```

---

## QUALITY CHECKLIST

Before considering any screen "done":

- [ ] Zero emoji anywhere in the app (use Feather icons only)
- [ ] All category labels are text-only (no icons in chips)
- [ ] All fonts are ClashDisplay or GeneralSans — no system fonts
- [ ] All spacing follows the 8pt grid (4/8/16/24/32/48)
- [ ] All colors come from tokens.ts — no hex literals in components
- [ ] All list components use `keyExtractor={(item) => item._id.toString()}`
- [ ] Every screen has loading skeleton + error state + empty state
- [ ] Safe area insets applied on all screens (useSafeAreaInsets)
- [ ] No hardcoded data anywhere — all from API
- [ ] Bottom nav height accounts for safe area bottom
- [ ] Feather icons sized 20px (nav) or 22px (in-content) consistently
- [ ] Pressable components all have press animation via Reanimated
- [ ] No box shadows on flat white backgrounds (only on cards over white bg)
- [ ] Typography hierarchy respected: never body font for headings
- [ ] Orange used ONLY for: CTAs, active states, prices, wishlist filled, progress bars

---

## PACKAGES REQUIRED

```bash
npx expo install \
  expo-font \
  expo-image \
  expo-secure-store \
  expo-haptics \
  react-native-reanimated \
  react-native-gesture-handler \
  @gorhom/bottom-sheet \
  react-native-safe-area-context \
  react-native-screens \
  react-native-vector-icons \
  @react-native-picker/picker \
  @tanstack/react-query \
  zustand \
  axios
```

---

*This prompt defines a complete redesign. Every screen, every component, every token is specified. The design is: white / black / one orange / two fonts / Feather icons / zero emoji. Execute it precisely and the result will be top 1%.*