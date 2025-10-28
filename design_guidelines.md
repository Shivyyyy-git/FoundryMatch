# MatchUp Foundry Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based with LinkedIn + ProductHunt inspiration

Drawing from LinkedIn's professional networking patterns and ProductHunt's startup showcase aesthetics, combined with modern university platform sensibilities. The design balances professional credibility with energetic startup culture.

**Key Design Principles:**
- Trust & Credibility: Clean, professional interfaces that inspire confidence
- Discovery-Focused: Card-based layouts that showcase opportunities prominently
- Action-Oriented: Clear CTAs driving connections and applications
- Community Feel: Warm, approachable design reflecting university culture

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 220 85% 35% (University of Rochester Royal Blue)
- Primary Hover: 220 85% 30%
- Accent: 40 95% 55% (Rochester Gold, use sparingly for CTAs and highlights)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Border: 220 15% 90%
- Text Primary: 220 20% 15%
- Text Secondary: 220 10% 45%
- Success: 150 75% 40%
- Warning: 40 90% 50%

**Dark Mode:**
- Primary: 220 85% 55%
- Primary Hover: 220 85% 60%
- Accent: 40 95% 60%
- Background: 220 15% 10%
- Surface: 220 12% 14%
- Border: 220 10% 25%
- Text Primary: 220 5% 95%
- Text Secondary: 220 5% 70%
- Success: 150 60% 50%
- Warning: 40 85% 55%

### B. Typography

**Font Families:**
- Headings: 'Inter', sans-serif (weights: 600, 700, 800)
- Body: 'Inter', sans-serif (weights: 400, 500, 600)
- Monospace (for tags/code): 'JetBrains Mono', monospace

**Type Scale:**
- Hero Heading: text-5xl md:text-6xl font-bold
- Page Title: text-4xl font-bold
- Section Heading: text-3xl font-semibold
- Card Title: text-xl font-semibold
- Body Large: text-lg font-medium
- Body: text-base
- Small: text-sm
- Tiny: text-xs

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24

**Container Strategy:**
- Max-width: max-w-7xl for main content areas
- Padding: px-4 md:px-6 lg:px-8
- Section spacing: py-12 md:py-16 lg:py-20
- Card spacing: p-6 md:p-8
- Compact cards: p-4

**Grid Patterns:**
- Team/Project cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Startup showcase: grid-cols-1 md:grid-cols-2 gap-8
- Profile sections: Two-column layout on desktop (sidebar + main content)

### D. Component Library

**Navigation Bar:**
- Fixed top navigation with logo, menu items, search, and profile dropdown
- Height: h-16
- Background: Surface color with border-b
- Sticky positioning with backdrop-blur effect

**User Cards (Team Matching):**
- White surface with subtle shadow (shadow-sm hover:shadow-md)
- Avatar: Circular, 64×64px
- Name: text-lg font-semibold
- Role/Year: text-sm text-secondary
- Skills: Flex-wrapped pill badges with primary-100 background
- Action buttons: "View Profile" and "Connect" CTAs
- Border radius: rounded-xl

**Project Gig Cards:**
- Featured image or gradient background header
- Company/Startup logo in corner
- Title: text-xl font-semibold
- Short description: 2-3 lines with text-secondary
- Tags: Skill requirements as colored pills
- Footer: Time commitment, deadline, "Apply" CTA
- Border radius: rounded-xl

**Startup Showcase Cards:**
- Large featured image (16:9 aspect ratio)
- Overlay gradient for text readability
- Logo placement: Top-left corner, rounded
- Tagline: text-lg on image overlay
- Team size indicator
- "Learn More" CTA as outline button with blurred background
- Border radius: rounded-2xl

**Messaging Interface:**
- Split layout: Conversation list (w-80) + Active chat
- Message bubbles: Sent (primary color), Received (surface-secondary)
- Timestamp: text-xs text-secondary
- Input: Sticky bottom with rounded-full input field
- Border radius: rounded-2xl for bubbles

**Forms & Inputs:**
- Input fields: rounded-lg with border, focus:ring-2 focus:ring-primary
- Labels: text-sm font-medium mb-2
- Dropdowns: Custom styled with chevron icon
- File upload: Drag-and-drop zone with dashed border
- Consistent dark mode support with proper contrast

**Buttons:**
- Primary: bg-primary text-white rounded-lg px-6 py-2.5 font-medium
- Secondary: bg-surface border-2 border-primary text-primary rounded-lg
- Outline (on images): backdrop-blur-md bg-white/20 border border-white/40
- Icon buttons: p-2 rounded-lg hover:bg-surface-hover
- Sizes: text-sm (default), text-base (large)

**Badges & Tags:**
- Skill tags: rounded-full px-3 py-1 text-xs font-medium
- Status badges: rounded-md px-2 py-1 text-xs font-semibold
- Color variants: primary-subtle, success-subtle, warning-subtle

### E. Images

**Hero Section (Homepage):**
Large, vibrant hero image showing diverse students collaborating in a modern University of Rochester setting (library, innovation space, or campus landmark). Image should be 1920×800px, with gradient overlay (bottom-to-top, dark to transparent) for text readability. Place "Find Your Team. Build Your Future." headline and search bar over the hero.

**Profile Photos:**
- User avatars: Circular, 40×40px (small), 64×64px (medium), 128×128px (large)
- Default avatar: Initials on colored background generated from name

**Startup Showcase Images:**
Product screenshots, team photos, or brand visuals at 800×450px. Use subtle shadow and border radius.

**Project Gig Images:**
Optional header images (600×300px) representing the project type or company brand.

**Icon Library:**
Use Heroicons (outline and solid variants) via CDN for all interface icons.

## Page-Specific Layouts

**Homepage:** Hero with search → Featured Startups (3 cards) → Latest Projects (grid) → How It Works (3 steps) → CTA section

**Team Matching:** Filter sidebar (left, collapsible on mobile) + Grid of student cards with infinite scroll

**Startup Showcase:** Masonry grid layout with featured startups highlighted with larger cards

**Messages:** Two-column split with conversation list and active chat pane

**Profile:** Cover photo banner → Avatar + Bio (left column, w-80) → Tabs for About/Projects/Startups (main column)