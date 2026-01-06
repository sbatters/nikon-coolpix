# Web Accessibility Features

This document outlines the accessibility improvements implemented in the Nikon Coolpix S630 photo gallery website.

## Overview

The site now follows WCAG 2.1 Level AA standards with comprehensive accessibility features for keyboard navigation, screen readers, and assistive technologies.

## Implemented Features

### 1. Semantic HTML
- **Landmark Regions**: Proper use of `<header>`, `<nav>`, `<main>` with appropriate ARIA roles
- **role="banner"**: Header element
- **role="main"**: Main content area
- **role="region"**: Gallery container with descriptive label

### 2. Skip Navigation
- **Skip Link**: "Skip to main content" link appears on keyboard focus
- Allows keyboard users to bypass navigation and jump directly to gallery content
- Positioned absolutely and visible only on focus

### 3. ARIA Labels & Attributes

#### Navigation
- `aria-label="Main navigation"` on nav element
- `aria-haspopup="true"` on dropdown button
- `aria-expanded` dynamically updates (true/false) based on dropdown state
- `aria-label="Filter gallery by category"` on filter button
- `role="menu"` and `role="menuitem"` on dropdown items

#### Images
- All gallery thumbnails have `role="button"` 
- `tabindex="0"` makes images keyboard accessible
- Dynamic `aria-label` with descriptive text: "View [category] photo [filename]"
- `aria-hidden="true"` applied to filtered-out images

#### Loading State
- `role="status"` on loading overlay
- `aria-live="polite"` for loading announcements
- `aria-hidden="true"` on decorative spinner

#### Enlarged View Dialog
- `role="dialog"` on enlarged image view
- `aria-label="Enlarged photo view"` 
- `aria-label` on navigation buttons (Previous/Next image)
- `aria-label` on back button with descriptive action

### 4. Alt Text
- All images include descriptive alt text: `[category] photo - [filename]`
- Alt text automatically generated from category and filename data
- Category names formatted (e.g., "grand-canyon" becomes "grand canyon")

### 5. Keyboard Navigation

#### Gallery Navigation
- **Tab**: Navigate between images and controls
- **Enter/Space**: Open image in enlarged view
- All interactive elements are keyboard accessible

#### Dropdown Menu
- **Click/Enter**: Toggle dropdown
- **Arrow Down/Up**: Navigate menu items
- **Escape**: Close dropdown and return focus to button
- **Tab**: Close dropdown and move to next focusable element

#### Enlarged View
- **Escape**: Close enlarged view, return focus to thumbnail
- **Arrow Left**: Previous image (when not disabled)
- **Arrow Right**: Next image (when not disabled)
- **Tab**: Navigate between back button and nav buttons

### 6. Focus Management
- Clear visible focus indicators (3px blue outline, 2px offset)
- Focus automatically moves to dialog when opened
- Focus returns to clicked thumbnail when dialog closes
- Disabled navigation buttons properly marked

### 7. Visual Focus Indicators
- All interactive elements have visible focus states:
  - **Buttons**: 3px solid blue outline (#4A90E2)
  - **Images**: 3px solid blue outline with scale transform
  - **Menu items**: Background color change
  - **2px offset** prevents overlap with content

### 8. Screen Reader Announcements
- Filter changes announced with visible count
- `role="status"` with `aria-live="polite"` for non-intrusive announcements
- Example: "Filtered to desert. Showing 14 images."
- Announcements automatically removed after 1 second

### 9. Screen Reader Only Class
- `.sr-only` utility class for visually hidden but screen-readable content
- Used for announcements that should only be perceived by assistive technology

### 10. Decorative Elements
- `aria-hidden="true"` on decorative arrows and spinner
- Prevents screen readers from announcing non-essential visual elements

## Color Contrast
- Button text: White on #333 (dark gray) - Passes WCAG AA
- Focus indicators: #4A90E2 (blue) provides strong contrast
- Loading text: #333 on white background - Passes WCAG AA

## Testing Recommendations

### Keyboard Testing
1. Use Tab to navigate through all interactive elements
2. Use Enter/Space to activate buttons and images
3. Use arrow keys in dropdown menu and enlarged view
4. Use Escape to close dropdowns and dialogs
5. Verify focus is always visible
6. Ensure focus returns appropriately when closing dialogs

### Screen Reader Testing
Recommended tools:
- **NVDA** (Windows - Free)
- **JAWS** (Windows - Commercial)
- **VoiceOver** (macOS/iOS - Built-in)
- **TalkBack** (Android - Built-in)

Test scenarios:
1. Navigate through page structure (landmarks)
2. Access filter dropdown and menu items
3. Navigate gallery images and hear descriptions
4. Open enlarged view and navigate between images
5. Verify announcements are clear and helpful

### Automated Testing Tools
- **axe DevTools** (Browser extension)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools)

## Browser Support
All accessibility features work in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements
Potential improvements to consider:
- Add live region for image count updates
- Implement roving tabindex for gallery grid
- Add detailed image descriptions beyond filename
- Consider adding high contrast mode support
- Add reduced motion preference support
- Implement touch gesture alternatives
