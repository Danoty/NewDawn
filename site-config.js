/*
 * NewDawn School site configuration
 * ---------------------------------
 * Update verified details here before launch. Keep unknown values as an empty
 * string. The site will continue to work without optional social links.
 */
window.NEWDawn_CONFIG = Object.freeze({
  school: {
    name: "NewDawn School",
    phoneDisplay: "+254 769 924 670",
    phoneInternational: "+254769924670",
    whatsappNumber: "254769924670",
    // TODO: Confirm whether the email domain is .sh.ke or .sc.ke.
    email: "info@newdawnschool.sh.ke",
    website: "https://newdawnschool.sc.ke/",
    address: "Bondo-Kisian Highway, Bondo, Siaya County, Kenya",
    mapQuery: "New Dawn School Bondo Kenya",
    officeHours: ""
  },
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: ""
  },
  admissions: {
    acceptingEnquiries: true,
    feesDocumentUrl: "",
    applicationFormUrl: "",
    admissionsDeadline: ""
  },
  features: {
    analyticsEnabled: false,
    newsEnabled: false,
    eventsEnabled: false,
    testimonialsEnabled: false,
    staffProfilesEnabled: false
  },
  analytics: {
    // Add an approved privacy-friendly analytics ID only after policy review.
    provider: "",
    siteId: ""
  }
});
