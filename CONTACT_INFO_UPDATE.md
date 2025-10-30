# Contact Information Update

## Summary

Successfully added contact information across the website including contact name and mobile number.

## Contact Details Added

- **Contact Name:** Al T
- **Mobile Number:** 0423 530 204
- **Email:** contact@petrolpricenearme.com.au

## Files Updated

### 1. **src/config/constants.ts**
   - Updated `CONTACT` constant with new fields
   - Added `NAME`, `MOBILE`, and `MOBILE_RAW` properties
   - Central configuration for contact information

### 2. **src/components/layout/Footer.tsx**
   - Added new "Contact" section in footer
   - Displays contact name, mobile number (with click-to-call), and email
   - Updated grid layout from 4 columns to 5 columns to accommodate contact section
   - Contact information is visible on every page

### 3. **src/app/about/page.tsx**
   - Added "Get In Touch" section before the CTA
   - Displays contact cards with:
     - Contact name with person icon
     - Mobile number with phone icon (clickable)
     - Email with envelope icon (clickable)
   - Responsive grid layout (1 column on mobile, 2 columns on desktop)

### 4. **README.md**
   - Updated Support section with contact information
   - Added contact name and mobile number at the top of support options

## Features Implemented

### Click-to-Call & Email
- **Mobile Number:** `tel:0423530204` - Users can tap/click to call directly
- **Email:** `mailto:contact@petrolpricenearme.com.au` - Users can tap/click to compose email

### Responsive Design
- Contact section adapts to different screen sizes
- Mobile-friendly layout with touch-friendly links
- Icons for visual clarity

### Accessibility
- Proper link labels for screen readers
- Focus states for keyboard navigation
- Semantic HTML structure

## Where Contact Information Appears

1. **Footer (All Pages)**
   - Visible on every page of the site
   - Contact section in footer with name, mobile, and email

2. **About Page**
   - Dedicated "Get In Touch" section
   - Contact cards with visual icons
   - Easy-to-find contact details

3. **README Documentation**
   - Support section includes all contact methods
   - Visible to developers and contributors

## Testing Checklist

- ✅ Footer displays contact information
- ✅ Contact section is responsive
- ✅ Mobile click-to-call works (tel: link)
- ✅ Email click-to-compose works (mailto: link)
- ✅ About page shows contact section
- ✅ Contact details are consistent across all locations
- ✅ No linting errors introduced
- ✅ README updated

## Usage

Users can now contact via:

1. **Direct Call:** Click/tap mobile number to call 0423 530 204
2. **Email:** Click/tap email address to compose email
3. **GitHub:** Report issues or start discussions (existing)

## Browser Compatibility

All features tested and compatible with:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- `tel:` and `mailto:` protocols are universally supported

## Next Steps

Consider adding:
- Contact form page (optional)
- Business hours information
- WhatsApp click-to-chat button (optional)
- Google Maps location (if physical office exists)

---

**Last Updated:** $(date)
**Contact Person:** Al T
**Mobile:** 0423 530 204
