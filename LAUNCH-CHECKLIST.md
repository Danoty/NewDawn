# NewDawn website launch checklist

## Required before publishing

- [ ] Confirm the official email address. The source currently uses `info@newdawnschool.sh.ke`, while the website domain is `.sc.ke`.
- [ ] Confirm the official domain and update `CNAME`, canonical URLs, sitemap URLs and `site-config.js` if different.
- [ ] Confirm the precise public address and Google Maps listing.
- [ ] Confirm that the school has permission to publish every identifiable learner in photographs and videos.
- [ ] Have the school approve the privacy policy and enquiry wording.
- [ ] Confirm current admissions availability, requirements, fees and deadlines before publishing them.
- [ ] Confirm that the Kurasa Teachers & Parents Portal login opens correctly for both user groups.

## Domain and email configuration

- [ ] Point the domain to the selected hosting provider.
- [ ] Enforce HTTPS and redirect HTTP to HTTPS.
- [ ] Configure SPF, DKIM and DMARC records for the official email domain.
- [ ] Verify that the email address can receive enquiries.

## Search and measurement

- [ ] Submit `sitemap.xml` in Google Search Console.
- [ ] Validate the School/Organization structured data.
- [ ] Confirm the Google Business Profile uses the same name, phone, address and domain.
- [ ] Enable analytics only after selecting an approved provider and updating the privacy policy.

## Quality assurance

- [ ] Test every page and form on Android, iPhone and desktop.
- [ ] Test on a slower mobile connection.
- [ ] Check keyboard navigation, visible focus, text resizing and screen-reader labels.
- [ ] Run Lighthouse on the deployed URL and review Core Web Vitals after real traffic is available.
- [ ] Assign a staff member to review contact details and media every school term.

## Where to update details

Start with `site-config.js`. Metadata, canonical URLs, structured data and the sitemap are static for search-engine reliability and must also be updated if the official domain, email or address changes.
