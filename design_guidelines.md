# MatchUp by Ain Center - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (LinkedIn-Inspired)

Drawing heavily from LinkedIn's professional networking patterns with adaptations for university context. The design prioritizes trust, clarity, and excellent information hierarchy while maintaining approachability for students.

**Key Design Principles:**
- Professional Trust: Clean, minimal interfaces that inspire confidence
- Information Clarity: Excellent hierarchy and scannable content
- Connection-Focused: Facilitating meaningful professional relationships
- University Context: Professional yet accessible for students

## Core Design Elements

### A. Typography

**Font Families:**
- All Text: 'Inter', sans-serif (weights: 400, 500, 600, 700)

**Type Scale:**
- Hero Heading: text-5xl md:text-6xl lg:text-7xl font-bold leading-tight
- Page Title: text-4xl font-bold
- Section Heading: text-2xl font-semibold
- Card Title: text-lg font-semibold
- Subheading: text-base font-medium
- Body: text-base (15px equivalent)
- Secondary: text-sm
- Caption: text-xs

**Line Height:**
- Headings: leading-tight (1.2)
- Body: leading-relaxed (1.6)

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32

**Container Strategy:**
- Main content: max-w-7xl mx-auto
- Narrow content: max-w-4xl mx-auto
- Full-width sections: w-full with inner constraints
- Standard padding: px-6 md:px-8 lg:px-12
- Section spacing: py-16 md:py-20 lg:py-24
- Component spacing: space-y-8 md:space-y-12

**Grid Patterns:**
- Three-column cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Two-column split: grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12
- Feed layout: Single column max-w-2xl with sidebar

### C. Component Library

**Navigation Bar:**
- Fixed top, h-16, backdrop-blur-sm with subtle border-b
- Logo left, main nav center, profile/notifications right
- Search bar integrated (expandable on mobile)
- Clean dropdown menus with dividers
- Active state: subtle bottom border on nav items

**Profile Cards (Team Matching):**
- Clean white background with subtle border (border-gray-200)
- Professional circular avatar: 80×80px (card), 120×120px (profile header)
- Name: text-lg font-semibold
- Title/Year/Major: text-sm text-gray-600
- Bio snippet: 2 lines, text-sm
- Skills: Subtle pill badges with gray backgrounds
- Connection status indicator
- "Connect" primary button + "Message" secondary
- Hover: subtle shadow elevation
- Border radius: rounded-lg

**Opportunity Cards (Startups/Projects):**
- Company logo badge: 48×48px, top-left
- Title: text-xl font-semibold
- Company name: text-sm font-medium text-gray-700
- Description: 3-4 lines, text-sm text-gray-600
- Metadata row: location, type, posted date with icons
- Skill tags: rounded-full badges
- "View Details" button, full-width at bottom
- Border radius: rounded-lg
- Border: subtle border-gray-200

**Feed Posts/Updates:**
- Card-based with author info header (avatar + name + timestamp)
- Content area with proper spacing
- Action bar: Like, Comment, Share icons
- Engagement counts
- Comment section expandable
- Border radius: rounded-lg

**Messaging Interface:**
- Three-column: Conversations list (320px) | Active chat | Contact info sidebar (280px, collapsible)
- Message bubbles: sent (primary-50 background), received (gray-100)
- Timestamps: text-xs text-gray-500 outside bubbles
- Input: bottom-fixed with rounded-full field and send button
- Professional avatar in each message
- Border radius: rounded-2xl for bubbles, rounded-lg for containers

**Search & Filters:**
- Prominent search bar: rounded-full with icon prefix
- Filter chips: rounded-full, dismissible with X
- Advanced filters: dropdown panels with checkboxes and range sliders
- Applied filters visible above results
- Filter sidebar on desktop, drawer on mobile

**Forms & Inputs:**
- Input fields: rounded-md, border-gray-300, focus:ring-2 focus:ring-blue-500
- Labels: text-sm font-medium text-gray-700 mb-2
- Helper text: text-xs text-gray-500
- Error states: red border and text
- Multi-select dropdowns with pills
- Rich text editor for descriptions
- Image upload with preview thumbnails

**Buttons:**
- Primary: bg-[deep-navy] text-white rounded-md px-6 py-2.5 font-medium shadow-sm
- Secondary: bg-white border border-gray-300 text-gray-700 rounded-md
- Text button: text-blue-600 hover:underline
- Icon buttons: p-2 rounded-md hover:bg-gray-100
- Button groups: segmented control style
- On images: backdrop-blur-md bg-white/90 border-0 shadow-lg

**Navigation Tabs:**
- Underline style (LinkedIn pattern)
- Active: border-b-2 border-blue-600 text-blue-600
- Inactive: text-gray-600 hover:text-gray-900
- Spacing: px-4 py-3

**Badges & Status:**
- Skill badges: rounded-full px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700
- Status indicators: small circular dots with colors
- Connection degree: "1st", "2nd", "3rd" in small gray badges
- Premium features: gold accent badges

**Modals & Overlays:**
- Centered overlay with backdrop blur
- Clean header with title and close button
- Content area with proper padding (p-6)
- Footer with action buttons
- Border radius: rounded-xl
- Max-width: max-w-2xl

### D. Images

**Hero Section (Homepage):**
Professional hero image (1920×600px) featuring University of Rochester students collaborating in a modern setting - bright, natural lighting showing diversity and engagement. Overlay: dark gradient (bottom-up, opacity 0.7 to 0) for text readability. Hero contains: headline "Connect. Collaborate. Launch Your Career." + subheading + prominent search bar with blurred-background buttons.

**Profile Covers:**
Wide banner images (1200×300px) - optional professional backgrounds or University of Rochester campus imagery. Subtle overlay if text present.

**Company/Startup Logos:**
Square logos (200×200px) displayed as circles or rounded squares (48×48px to 120×120px depending on context). Default: colored background with initials.

**Professional Avatars:**
High-quality headshots, circular display:
- Feed/Cards: 48×48px
- Profile header: 160×160px
- Messages: 40×40px
- Default: Initials on solid color background

**Opportunity Images:**
Featured images for startup showcases (800×450px, 16:9 ratio). Product screenshots or team photos with subtle shadows.

**Content Images:**
In-feed images supporting posts/updates, flexible aspect ratios with max-height constraints.

**Icon Library:**
Heroicons (outline style primarily) via CDN for all UI icons - consistent stroke width.

## Page-Specific Layouts

**Homepage:**
Hero with search → Value propositions (3-column grid) → Featured Opportunities (4 cards) → Success Stories (2-column) → How It Works (horizontal timeline) → CTA section with stats

**Team Matching (Feed):**
Left sidebar: Filters (collapsible on mobile, w-64)
Main feed: Student profile cards in single column (max-w-2xl)
Right sidebar: Suggested connections, upcoming events (w-80, hidden on tablet)

**Opportunity Discovery:**
Search bar with filter chips → Two-column grid of opportunity cards → Pagination
Individual view: Full opportunity details with sidebar (company info, similar opportunities)

**Profile Page:**
Cover photo → Avatar + headline (centered) → About section → Experience timeline → Skills grid → Projects showcase → Recommendations
Two-column on desktop: Main content (2/3) + Sidebar (1/3) with contact card, education, connections

**Messages:**
Three-pane layout: Conversations | Active Chat | Contact Details
Mobile: Single pane with navigation between views

**Dashboard/Home Feed:**
LinkedIn-style feed with posts, updates, recommended opportunities
Infinite scroll with loading states

## Accessibility & States

**Focus States:**
- Visible ring: ring-2 ring-blue-500 ring-offset-2
- Skip to main content link
- Keyboard navigation throughout

**Hover States:**
- Cards: subtle shadow elevation (shadow-md)
- Links: underline or color shift
- Buttons: slight darkening or brightness shift

**Loading States:**
- Skeleton screens matching content structure
- Shimmer effect on placeholder cards
- Progress indicators for async actions

**Empty States:**
- Centered with illustration/icon
- Clear heading and supportive text
- Primary action button