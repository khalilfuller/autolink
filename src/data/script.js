// Function that generates the script with custom domains and initial lookback
export function getAutoLinkScript(domains = ['yourcompany.com'], initialLookbackDays = 30) {
  const domainsStr = domains.map(d => `'${d}'`).join(', ')

  return `/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                           AutoLink v1.0                                    ║
 * ║    Automatically track people you email or meet with for LinkedIn connects ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Created by Khalil Fuller & Claude
 * https://www.linkedin.com/in/khalilfuller/
 *
 * SETUP:
 * 1. Copy this entire script into a new Google Apps Script project (script.google.com)
 * 2. Run the setup() function once
 * 3. Authorize Gmail and Calendar access when prompted
 * 4. Bookmark the Google Sheet URL that appears in the logs
 *
 * USAGE:
 * - Script runs automatically overnight on Friday nights (Saturday 3am PT)
 * - Check your sheet Saturday mornings for new contacts
 * - Click LinkedIn Search links, find profiles, connect!
 */

// ============================================================================
// CONFIGURATION - Customize these settings
// ============================================================================

const CONFIG = {
  // Your company domain(s) - contacts from these domains will be excluded
  OWN_DOMAINS: [${domainsStr}],

  // Set to false if you want to include coworkers
  EXCLUDE_OWN_DOMAIN: true,

  // How many days back to scan for emails (default: 7 for weekly runs)
  DAYS_TO_SCAN: 7,

  // How many days back to scan on FIRST run (to populate initial contacts)
  INITIAL_DAYS_TO_SCAN: ${initialLookbackDays},

  // When to run the weekly scan (Saturday 3am PT = Friday night)
  TRIGGER_DAY: ScriptApp.WeekDay.SATURDAY,
  TRIGGER_HOUR: 3, // 3 AM (24-hour format)

  // Sheet naming
  SHEET_NAME: 'AutoLink',
  MASTER_TAB_NAME: 'Master',
};

// Email patterns to exclude (newsletters, automated emails, etc.)
const EXCLUDED_PATTERNS = [
  /^noreply@/i,
  /^no-reply@/i,
  /^do-?not-?reply@/i,
  /^notifications?@/i,
  /^alerts?@/i,
  /^support@/i,
  /^help@/i,
  /^info@/i,
  /^hello@/i,
  /^contact@/i,
  /^newsletter@/i,
  /^news@/i,
  /^mailer-daemon@/i,
  /^postmaster@/i,
  /^calendar-notification@/i,
  /@calendar\\./i,
  /@docs\\./i,
  /^bounce@/i,
  /^feedback@/i,
  /@.*\\.gserviceaccount\\.com$/i,
  /^daemon@/i,
  /^auto-confirm@/i,
  /^confirmation@/i,
  /^receipts?@/i,
  /^billing@/i,
  /^invoices?@/i,
  /^orders?@/i,
  /^shipping@/i,
  /^tracking@/i,
  /^admin@/i,
  /^sales@/i,
  /^marketing@/i,
  /^team@/i,
  /^hr@/i,
  /^recruiting@/i,
  /^careers@/i,
  /^jobs@/i,
  // Additional automated/system emails
  /^security@/i,
  /^privacy@/i,
  /^legal@/i,
  /^compliance@/i,
  /^accounts?@/i,
  /^service@/i,
  /^customerservice@/i,
  /^customer-service@/i,
  /^helpdesk@/i,
  /^webmaster@/i,
  /^sysadmin@/i,
  /^root@/i,
  /^abuse@/i,
  /^spam@/i,
  /^unsubscribe@/i,
  /^optout@/i,
  /^opt-out@/i,
  /^donotreply@/i,
  /^automated@/i,
  /^auto@/i,
  /^system@/i,
  /^robot@/i,
  /^bot@/i,
  /^cron@/i,
  /^scheduler@/i,
  /^digest@/i,
  /^updates?@/i,
  /^notify@/i,
  /^reminder@/i,
  /^subscriptions?@/i,
  /^welcome@/i,
  /^onboarding@/i,
  /^invites?@/i,
  /^rsvp@/i,
  /^events?@/i,
  /^registrations?@/i,
  /^payments?@/i,
  /^transactions?@/i,
  /^refunds?@/i,
  /^returns?@/i,
  /^delivery@/i,
  /^fulfillment@/i,
  /^warehouse@/i,
  /^logistics@/i,
  /^procurement@/i,
  /^purchasing@/i,
  /^vendors?@/i,
  /^suppliers?@/i,
  /^partners?@/i,
  /^affiliates?@/i,
  /^press@/i,
  /^media@/i,
  /^pr@/i,
  /^comms?@/i,
  /^communications?@/i,
  /^social@/i,
  /^community@/i,
  /^forum@/i,
  /^moderator@/i,
  /^editorial@/i,
  /^editor@/i,
  /^content@/i,
  /^creative@/i,
  /^design@/i,
  /^dev@/i,
  /^engineering@/i,
  /^tech@/i,
  /^it@/i,
  /^ops@/i,
  /^operations@/i,
  /^finance@/i,
  /^accounting@/i,
  /^payroll@/i,
  /^benefits@/i,
  /^talent@/i,
  /^people@/i,
  /^culture@/i,
  /^learning@/i,
  /^training@/i,
  /^education@/i,
  /^research@/i,
  /^analytics@/i,
  /^data@/i,
  /^reports?@/i,
  /^metrics@/i,
  /^dashboard@/i,
  /^monitor@/i,
  /^status@/i,
  /^health@/i,
  /^test@/i,
  /^testing@/i,
  /^staging@/i,
  /^demo@/i,
  /^sandbox@/i,
  /^trial@/i,
  // Platform-specific automated emails
  /@.*\\.slack\\.com$/i,
  /@.*\\.notion\\.com$/i,
  /@.*\\.figma\\.com$/i,
  /@.*\\.asana\\.com$/i,
  /@.*\\.monday\\.com$/i,
  /@.*\\.trello\\.com$/i,
  /@.*\\.jira\\.com$/i,
  /@.*\\.atlassian\\.com$/i,
  /@.*\\.github\\.com$/i,
  /@.*\\.gitlab\\.com$/i,
  /@.*\\.bitbucket\\.org$/i,
  /@.*\\.heroku\\.com$/i,
  /@.*\\.vercel\\.com$/i,
  /@.*\\.netlify\\.com$/i,
  /@.*\\.aws\\.com$/i,
  /@.*\\.amazonaws\\.com$/i,
  /@.*\\.azure\\.com$/i,
  /@.*\\.stripe\\.com$/i,
  /@.*\\.paypal\\.com$/i,
  /@.*\\.square\\.com$/i,
  /@.*\\.shopify\\.com$/i,
  /@.*\\.mailchimp\\.com$/i,
  /@.*\\.sendgrid\\.com$/i,
  /@.*\\.twilio\\.com$/i,
  /@.*\\.zendesk\\.com$/i,
  /@.*\\.intercom\\.com$/i,
  /@.*\\.hubspot\\.com$/i,
  /@.*\\.salesforce\\.com$/i,
  /@.*\\.docusign\\.com$/i,
  /@.*\\.dropbox\\.com$/i,
  /@.*\\.box\\.com$/i,
  /@.*\\.zoom\\.us$/i,
  /@.*\\.calendly\\.com$/i,
  /@.*\\.eventbrite\\.com$/i,
  /@.*\\.meetup\\.com$/i,
  /@.*\\.linkedin\\.com$/i,
  /@.*\\.facebook\\.com$/i,
  /@.*\\.twitter\\.com$/i,
  /@.*\\.instagram\\.com$/i,
  /@.*\\.youtube\\.com$/i,
  /@.*\\.tiktok\\.com$/i,
  /@.*\\.reddit\\.com$/i,
  /@.*\\.medium\\.com$/i,
  /@.*\\.substack\\.com$/i,
  /@.*\\.patreon\\.com$/i,
  /@.*\\.kickstarter\\.com$/i,
  /@.*\\.indiegogo\\.com$/i,
  /@.*\\.uber\\.com$/i,
  /@.*\\.lyft\\.com$/i,
  /@.*\\.doordash\\.com$/i,
  /@.*\\.grubhub\\.com$/i,
  /@.*\\.instacart\\.com$/i,
  /@.*\\.airbnb\\.com$/i,
  /@.*\\.booking\\.com$/i,
  /@.*\\.expedia\\.com$/i,
  /@.*\\.tripadvisor\\.com$/i,
  /@facebookmail\\.com$/i,
  /@linkedin\\.com$/i,
];

// ============================================================================
// SETUP - Run this once to initialize everything
// ============================================================================

/**
 * One-time setup function. Run this first!
 * Creates the Google Sheet and sets up the weekly trigger.
 */
function setup() {
  Logger.log('🚀 Starting AutoLink setup...');

  // Check if already set up
  const existingSheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (existingSheetId) {
    try {
      const existingSheet = SpreadsheetApp.openById(existingSheetId);
      Logger.log('⚠️ Already set up! Your sheet is at:');
      Logger.log(existingSheet.getUrl());
      Logger.log('To start fresh, run resetSetup() first.');
      return;
    } catch (e) {
      // Sheet was deleted, continue with setup
      Logger.log('Previous sheet not found, creating new one...');
    }
  }

  // Create new spreadsheet
  const spreadsheet = SpreadsheetApp.create(CONFIG.SHEET_NAME);
  const sheetId = spreadsheet.getId();

  // Store sheet ID for future use
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', sheetId);

  // Set up Master tab
  const masterSheet = spreadsheet.getActiveSheet();
  masterSheet.setName(CONFIG.MASTER_TAB_NAME);
  setupMasterTab(masterSheet);

  // Create first weekly tab
  const weekLabel = getWeekLabel(new Date());
  const weeklySheet = spreadsheet.insertSheet(weekLabel);
  setupWeeklyTab(weeklySheet);

  // Move weekly tab to first position
  spreadsheet.setActiveSheet(weeklySheet);
  spreadsheet.moveActiveSheet(1);

  // Set up weekly trigger
  setupWeeklyTrigger();

  Logger.log('✅ Setup complete! Let\\'s build your network! 🚀');
  Logger.log('');
  Logger.log('📊 Your Google Sheet is ready at:');
  Logger.log(spreadsheet.getUrl());
  Logger.log('');
  Logger.log('📋 HOW IT WORKS:');
  Logger.log('   • Each week gets its own tab (named by date)');
  Logger.log('   • New contacts appear in the weekly tab with LinkedIn search links');
  Logger.log('   • The "Master" tab tracks everyone to avoid duplicates');
  Logger.log('');
  Logger.log('📅 WEEKLY ROUTINE:');
  Logger.log('   • Script runs automatically overnight on Friday nights');
  Logger.log('   • Check your sheet Saturday mornings for new contacts');
  Logger.log('   • Click the LinkedIn links, find profiles, and connect!');
  Logger.log('');
  Logger.log(\`🔄 Running first scan now (looking back \${CONFIG.INITIAL_DAYS_TO_SCAN} days)...\`);
  Logger.log('');

  // Run the first scan immediately with the extended lookback period
  main(CONFIG.INITIAL_DAYS_TO_SCAN);
}

/**
 * Reset setup - deletes stored sheet ID so you can run setup() again
 */
function resetSetup() {
  // Remove all triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Clear stored properties
  PropertiesService.getScriptProperties().deleteAllProperties();

  Logger.log('✅ Reset complete. You can now run setup() again.');
  Logger.log('Note: The old Google Sheet still exists in your Drive - delete it manually if needed.');
}

// ============================================================================
// MAIN EXECUTION - Called weekly by trigger
// ============================================================================

/**
 * Main function - orchestrates the weekly scan
 * Called automatically by the weekly trigger
 * @param {number} daysOverride - Optional: override the number of days to scan (used for initial setup)
 */
function main(daysOverride) {
  const daysToScan = daysOverride || CONFIG.DAYS_TO_SCAN;
  Logger.log(\`🔄 Starting AutoLink scan (last \${daysToScan} days)...\`);

  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) {
    Logger.log('❌ Error: Sheet not found. Run setup() first.');
    return;
  }

  // Get contacts from sent emails
  const emailContacts = getOutboundContacts(daysToScan);
  Logger.log(\`📧 Found \${emailContacts.length} contacts from sent emails\`);

  // Get contacts from calendar meetings
  const calendarContacts = getCalendarContacts(daysToScan);
  Logger.log(\`📅 Found \${calendarContacts.length} contacts from calendar meetings\`);

  // Merge and deduplicate contacts from both sources
  const contacts = mergeContacts(emailContacts, calendarContacts);
  Logger.log(\`🔗 \${contacts.length} unique contacts total\`);

  // Filter out already-processed contacts
  const newContacts = filterNewContacts(spreadsheet, contacts);
  Logger.log(\`✨ \${newContacts.length} are new (not in Master list)\`);

  if (newContacts.length === 0) {
    Logger.log('No new contacts this week!');
    return;
  }

  // Get or create this week's tab
  const weekLabel = getWeekLabel(new Date());
  let weeklySheet = spreadsheet.getSheetByName(weekLabel);
  if (!weeklySheet) {
    weeklySheet = spreadsheet.insertSheet(weekLabel, 0);
    setupWeeklyTab(weeklySheet);
  }

  // Add contacts to weekly tab
  addToWeeklyTab(weeklySheet, newContacts);

  // Add contacts to Master tab (for future deduplication)
  addToMaster(spreadsheet, newContacts);

  Logger.log(\`✅ Added \${newContacts.length} new contacts to "\${weekLabel}" tab\`);
  Logger.log(\`📊 Sheet: \${spreadsheet.getUrl()}\`);
}

/**
 * Manual trigger - run this to do an immediate scan
 */
function runNow() {
  Logger.log('⚡ Manual scan triggered');
  main();
}

// ============================================================================
// GMAIL FUNCTIONS
// ============================================================================

/**
 * Fetches contacts from sent emails
 * @param {number} daysToScan - Number of days to look back
 * @returns {Array} Array of contact objects {name, email}
 */
function getOutboundContacts(daysToScan) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - daysToScan);
  const dateStr = Utilities.formatDate(daysAgo, Session.getScriptTimeZone(), 'yyyy/MM/dd');

  const query = \`in:sent after:\${dateStr}\`;

  // Batch fetch threads (Gmail API limits to 500 per search)
  let threads = [];
  try {
    threads = GmailApp.search(query, 0, 500);
  } catch (e) {
    Logger.log(\`⚠️ Gmail search error: \${e.message}\`);
    return [];
  }

  const contactsMap = new Map(); // Use Map to deduplicate by email

  threads.forEach(thread => {
    const messages = thread.getMessages();

    // First pass: collect all recipients from my sent messages
    messages.forEach(message => {
      const from = message.getFrom();
      if (!isMyEmail(from)) return;

      const toRecipients = message.getTo() || '';
      const ccRecipients = message.getCc() || '';
      const allRecipients = \`\${toRecipients}, \${ccRecipients}\`;

      const parsed = parseRecipients(allRecipients);
      parsed.forEach(contact => {
        if (!shouldExclude(contact.email)) {
          const key = contact.email.toLowerCase();
          if (!contactsMap.has(key)) {
            contactsMap.set(key, {
              ...contact,
              signatureInfo: null, // Will be enriched from their replies
              linkedInUrl: null,
            });
          }
        }
      });
    });

    // Second pass: scan replies from contacts to extract signature info
    messages.forEach(message => {
      const from = message.getFrom();
      if (isMyEmail(from)) return; // Skip my own messages

      const senderEmail = extractEmailFromString(from);
      if (!senderEmail) return;

      const key = senderEmail.toLowerCase();
      if (contactsMap.has(key)) {
        const contact = contactsMap.get(key);
        // Only parse signature if we haven't already
        if (!contact.signatureInfo) {
          const body = message.getPlainBody() || '';
          const sigInfo = extractSignatureInfo(body);
          if (sigInfo.company || sigInfo.title || sigInfo.linkedInUrl) {
            contact.signatureInfo = sigInfo;
            contact.linkedInUrl = sigInfo.linkedInUrl;
            contactsMap.set(key, contact);
          }
        }
      }
    });
  });

  return Array.from(contactsMap.values());
}

// ============================================================================
// CALENDAR FUNCTIONS
// ============================================================================

/**
 * Fetches contacts from calendar meeting attendees
 * @param {number} daysToScan - Number of days to look back
 * @returns {Array} Array of contact objects {name, email}
 */
function getCalendarContacts(daysToScan) {
  const now = new Date();
  const daysAgo = new Date(now.getTime() - daysToScan * 24 * 60 * 60 * 1000);

  const contactsMap = new Map();

  try {
    // Get all calendars the user has access to
    const calendars = CalendarApp.getAllCalendars();

    calendars.forEach(calendar => {
      // Skip calendars that aren't owned by the user (shared calendars, holidays, etc.)
      // We only want meetings the user actually attended
      if (!calendar.isOwnedByMe()) return;

      const events = calendar.getEvents(daysAgo, now);

      events.forEach(event => {
        // Skip all-day events (usually holidays, PTO, etc.)
        if (event.isAllDayEvent()) return;

        // Skip events where I'm not actually attending
        const myStatus = event.getMyStatus();
        if (myStatus === CalendarApp.GuestStatus.NO ||
            myStatus === CalendarApp.GuestStatus.INVITED) {
          return; // Skip if I declined or haven't responded
        }

        // Get all attendees
        const guests = event.getGuestList(true); // true = include self

        guests.forEach(guest => {
          const email = guest.getEmail();
          if (!email) return;

          // Skip if it's my email or should be excluded
          if (isMyEmail(email) || shouldExclude(email)) return;

          const key = email.toLowerCase();
          if (!contactsMap.has(key)) {
            // Try to get name from guest, fall back to email parsing
            let name = guest.getName();
            if (!name || name === email) {
              name = formatNameFromEmail(email);
            }

            contactsMap.set(key, {
              name: name,
              email: email.toLowerCase(),
              signatureInfo: null,
              linkedInUrl: null,
              source: 'calendar', // Track source for potential future use
            });
          }
        });
      });
    });
  } catch (e) {
    Logger.log(\`⚠️ Calendar access error: \${e.message}\`);
    Logger.log('Calendar scanning skipped. Grant calendar permissions if you want this feature.');
  }

  return Array.from(contactsMap.values());
}

/**
 * Merges contacts from multiple sources, deduplicating by email
 * Email contacts take priority (they have signature info)
 * @param {Array} emailContacts - Contacts from sent emails
 * @param {Array} calendarContacts - Contacts from calendar
 * @returns {Array} Merged and deduplicated contacts
 */
function mergeContacts(emailContacts, calendarContacts) {
  const merged = new Map();

  // Add email contacts first (they have richer data from signatures)
  emailContacts.forEach(contact => {
    merged.set(contact.email.toLowerCase(), contact);
  });

  // Add calendar contacts only if not already present from email
  calendarContacts.forEach(contact => {
    const key = contact.email.toLowerCase();
    if (!merged.has(key)) {
      merged.set(key, contact);
    }
  });

  return Array.from(merged.values());
}

/**
 * Extracts email address from a string like "John Doe <john@example.com>"
 */
function extractEmailFromString(str) {
  if (!str) return null;
  const match = str.match(/<([^>]+)>/) || str.match(/([\\w.-]+@[\\w.-]+\\.[a-z]{2,})/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Extracts useful info from email signature
 * Looks for: company name, job title, LinkedIn URL
 */
function extractSignatureInfo(body) {
  const info = {
    company: null,
    title: null,
    linkedInUrl: null,
  };

  if (!body) return info;

  // First, try to isolate the sender's content by removing quoted/forwarded content
  // Common quote indicators: lines starting with >, "On ... wrote:", "From:", forwarded message headers
  let senderContent = body;

  // Find where quoted content starts and trim it
  const quotePatterns = [
    /\\n>\\s/,                                    // Traditional > quote
    /\\nOn .+ wrote:/i,                          // "On [date] [person] wrote:"
    /\\n-{3,}\\s*Original Message/i,             // --- Original Message
    /\\n_{3,}\\s*$/m,                            // ___ separator
    /\\nFrom:\\s+.+\\nSent:/i,                   // Outlook forward header
    /\\n-{3,}\\s*Forwarded message/i,           // Forwarded message
    /\\nBegin forwarded message/i,              // Apple Mail forward
  ];

  for (const pattern of quotePatterns) {
    const match = senderContent.search(pattern);
    if (match > 100) { // Only cut if there's meaningful content before the quote
      senderContent = senderContent.slice(0, match);
      break;
    }
  }

  // Get the last ~1500 chars of the sender's actual content (where signature usually is)
  const signatureArea = senderContent.slice(-1500);

  // Look for LinkedIn URL (handles /in/ and older /pub/ formats)
  const linkedInMatch = signatureArea.match(/(?:https?:\\/\\/)?(?:www\\.)?linkedin\\.com\\/(?:in|pub)\\/([\\w-]+)/i);
  if (linkedInMatch) {
    info.linkedInUrl = \`https://www.linkedin.com/in/\${linkedInMatch[1]}\`;
  }

  // Common signature patterns for company/title
  // Pattern: "Title at Company" or "Title | Company" or "Title, Company"
  const titleCompanyPatterns = [
    /(?:^|\\n)([A-Z][a-zA-Z\\s]+)\\s+(?:at|@|\\|)\\s+([A-Z][a-zA-Z\\s&.]+?)(?:\\n|\\||$)/m,
    /(?:^|\\n)([A-Z][a-zA-Z\\s]+),\\s+([A-Z][a-zA-Z\\s&.]+?)(?:\\n|$)/m,
  ];

  for (const pattern of titleCompanyPatterns) {
    const match = signatureArea.match(pattern);
    if (match) {
      const potentialTitle = match[1].trim();
      const potentialCompany = match[2].trim();
      // Validate - titles usually have specific keywords
      if (/(?:manager|director|engineer|designer|founder|ceo|cto|cfo|coo|vp|president|analyst|consultant|lead|head|chief|partner|associate|intern|recruiter|advisor|attorney|lawyer|counsel|physician|doctor|nurse|professor|teacher|coach|specialist|coordinator|administrator|executive|officer|scientist|researcher|developer|architect|strategist)/i.test(potentialTitle)) {
        info.title = potentialTitle;
        info.company = potentialCompany;
        break;
      }
    }
  }

  // If no title/company found, look for standalone company indicators
  if (!info.company) {
    // Look for "Company Name" on its own line after the name
    const companyPatterns = [
      /(?:^|\\n)([A-Z][a-zA-Z\\s&.]+(?:Inc|LLC|Corp|Ltd|Company|Co|Group|Partners|Capital|Ventures|Labs|Studio|Agency)[.,]?)\\s*(?:\\n|$)/m,
    ];
    for (const pattern of companyPatterns) {
      const match = signatureArea.match(pattern);
      if (match) {
        info.company = match[1].trim().replace(/[.,]$/, '');
        break;
      }
    }
  }

  return info;
}

/**
 * Parses recipient string into array of contact objects
 * Handles formats like: "John Doe <john@example.com>, jane@example.com"
 * @param {string} recipientStr - Raw recipient string
 * @returns {Array} Array of {name, email} objects
 */
function parseRecipients(recipientStr) {
  if (!recipientStr) return [];

  const contacts = [];
  // Split by comma, but be careful of commas in quoted names
  const parts = recipientStr.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

  parts.forEach(part => {
    part = part.trim();
    if (!part) return;

    let name = '';
    let email = '';

    // Format: "Name" <email> or Name <email>
    const bracketMatch = part.match(/^"?([^"<]*)"?\\s*<([^>]+)>/);
    if (bracketMatch) {
      name = bracketMatch[1].trim().replace(/^"|"$/g, '');
      email = bracketMatch[2].trim().toLowerCase();
    } else if (part.includes('@')) {
      // Plain email address
      email = part.trim().toLowerCase();
      name = email.split('@')[0]; // Use local part as name fallback
    }

    if (email && isValidEmail(email)) {
      // Clean up name
      if (!name || name === email.split('@')[0]) {
        name = formatNameFromEmail(email);
      }
      contacts.push({ name, email });
    }
  });

  return contacts;
}

/**
 * Checks if an email address should be excluded
 * @param {string} email - Email address to check
 * @returns {boolean} True if should be excluded
 */
function shouldExclude(email) {
  if (!email) return true;

  email = email.toLowerCase();

  // Check against excluded patterns
  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(email)) return true;
  }

  // Check against own domain
  if (CONFIG.EXCLUDE_OWN_DOMAIN) {
    for (const domain of CONFIG.OWN_DOMAINS) {
      if (email.endsWith(\`@\${domain.toLowerCase()}\`)) return true;
    }
  }

  return false;
}

/**
 * Checks if an email is from the current user
 * Caches the user's email to avoid repeated API calls
 */
let _cachedUserEmail = null;
function isMyEmail(emailStr) {
  if (!_cachedUserEmail) {
    _cachedUserEmail = Session.getEffectiveUser().getEmail().toLowerCase();
  }
  return emailStr.toLowerCase().includes(_cachedUserEmail);
}

/**
 * Basic email validation
 */
function isValidEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

// ============================================================================
// SHEET FUNCTIONS
// ============================================================================

/**
 * Gets the spreadsheet, using stored ID
 */
function getSpreadsheet() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) return null;

  try {
    return SpreadsheetApp.openById(sheetId);
  } catch (e) {
    Logger.log(\`Error opening spreadsheet: \${e.message}\`);
    return null;
  }
}

/**
 * Sets up the Master tab with headers
 */
function setupMasterTab(sheet) {
  const headers = ['Email', 'Name', 'Date Added'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#f3f3f3');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 250); // Email
  sheet.setColumnWidth(2, 200); // Name
  sheet.setColumnWidth(3, 120); // Date
}

/**
 * Sets up a weekly tab with headers and formatting
 */
function setupWeeklyTab(sheet) {
  const headers = ['Name', 'Email', 'Company', 'LinkedIn Search', 'Google Search', 'Profile URL', 'Connected'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
  sheet.setFrozenRows(1);

  // Set column widths
  sheet.setColumnWidth(1, 180); // Name
  sheet.setColumnWidth(2, 250); // Email
  sheet.setColumnWidth(3, 150); // Company
  sheet.setColumnWidth(4, 130); // LinkedIn Search
  sheet.setColumnWidth(5, 130); // Google Search
  sheet.setColumnWidth(6, 250); // Profile URL
  sheet.setColumnWidth(7, 100); // Connected
}

/**
 * Filters contacts against Master list, returns only new ones
 */
function filterNewContacts(spreadsheet, contacts) {
  const masterSheet = spreadsheet.getSheetByName(CONFIG.MASTER_TAB_NAME);
  if (!masterSheet) return contacts;

  const lastRow = masterSheet.getLastRow();
  if (lastRow < 2) return contacts; // No existing data

  // Get all emails from Master (column A)
  const existingEmails = new Set(
    masterSheet.getRange(2, 1, lastRow - 1, 1)
      .getValues()
      .flat()
      .map(e => e.toString().toLowerCase())
  );

  return contacts.filter(c => !existingEmails.has(c.email.toLowerCase()));
}

/**
 * Adds contacts to the weekly tab
 */
function addToWeeklyTab(sheet, contacts) {
  const rows = contacts.map(contact => {
    // Use signature company if available, otherwise extract from email domain
    let company = contact.signatureInfo?.company || extractCompanyFromEmail(contact.email);

    // Build search URLs
    const linkedInSearchUrl = buildLinkedInSearchUrl(contact.name, company, contact.signatureInfo?.title);
    const googleSearchUrl = buildGoogleSearchUrl(contact.name, company);

    // If we found their LinkedIn URL directly, use it
    const profileUrl = contact.linkedInUrl || '';

    return [
      contact.name,
      contact.email,
      company,
      \`=HYPERLINK("\${linkedInSearchUrl}", "🔍 LinkedIn")\`,
      \`=HYPERLINK("\${googleSearchUrl}", "🔍 Google")\`,
      profileUrl, // Pre-filled if found in signature
      false, // Connected checkbox
    ];
  });

  if (rows.length > 0) {
    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);

    // Add checkboxes to Connected column (now column 7)
    sheet.getRange(startRow, 7, rows.length, 1).insertCheckboxes();
  }
}

/**
 * Builds a Google search URL for finding someone's LinkedIn profile
 */
function buildGoogleSearchUrl(name, company) {
  const searchName = simplifyNameForSearch(name);
  let query = \`"\${searchName}" site:linkedin.com/in\`;
  if (company) {
    query += \` "\${company}"\`;
  }
  return \`https://www.google.com/search?q=\${encodeURIComponent(query)}\`;
}

/**
 * Adds contacts to Master tab for future deduplication
 */
function addToMaster(spreadsheet, contacts) {
  const masterSheet = spreadsheet.getSheetByName(CONFIG.MASTER_TAB_NAME);
  if (!masterSheet) return;

  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  const rows = contacts.map(contact => [
    contact.email.toLowerCase(),
    contact.name,
    today,
  ]);

  if (rows.length > 0) {
    const startRow = masterSheet.getLastRow() + 1;
    masterSheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
  }
}

/**
 * Generates the week label for tab naming (e.g., "01/26/2026")
 */
function getWeekLabel(date) {
  // Get the Sunday of the current week
  const sunday = new Date(date);
  const day = sunday.getDay();
  sunday.setDate(sunday.getDate() - day);

  return Utilities.formatDate(sunday, Session.getScriptTimeZone(), 'MM/dd/yyyy');
}

// ============================================================================
// LINKEDIN FUNCTIONS
// ============================================================================

/**
 * Simplifies name for search - keeps only first and last name
 * Middle names often cause LinkedIn searches to fail
 */
function simplifyNameForSearch(name) {
  if (!name) return '';
  const parts = name.trim().split(/\\s+/);
  if (parts.length <= 2) return name;
  // Keep first and last only
  return \`\${parts[0]} \${parts[parts.length - 1]}\`;
}

/**
 * Builds a LinkedIn search URL for a person
 * @param {string} name - Person's name
 * @param {string} company - Company name (can be empty)
 * @param {string} title - Job title (optional, from signature)
 */
function buildLinkedInSearchUrl(name, company, title) {
  let query = simplifyNameForSearch(name);

  // Add title if we have it (very helpful for narrowing results)
  if (title) {
    query += \` \${title}\`;
  }

  if (company) {
    query += \` \${company}\`;
  }
  const encoded = encodeURIComponent(query);
  return \`https://www.linkedin.com/search/results/people/?keywords=\${encoded}\`;
}

/**
 * Extracts company name from email domain
 * Handles edge cases like multi-word names, acronyms, subdomains, etc.
 */
function extractCompanyFromEmail(email) {
  if (!email || !email.includes('@')) return '';

  const domain = email.split('@')[1].toLowerCase();

  // Common email providers - no company info
  const genericDomains = [
    'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com',
    'outlook.com', 'live.com', 'msn.com', 'icloud.com', 'me.com',
    'aol.com', 'protonmail.com', 'mail.com', 'zoho.com', 'ymail.com',
    'fastmail.com', 'hey.com', 'pm.me', 'tutanota.com'
  ];

  if (genericDomains.includes(domain)) {
    return '';
  }

  // Known company/institution mappings for better search results
  const knownMappings = {
    // Top Business Schools
    'chicagobooth': 'Chicago Booth',
    'kellogg': 'Kellogg Northwestern',
    'gsb': 'Stanford GSB',
    'hbs': 'Harvard Business School',
    'wharton': 'Wharton Penn',
    'tuck': 'Tuck Dartmouth',
    'haas': 'Haas Berkeley',
    'ross': 'Ross Michigan',
    'fuqua': 'Fuqua Duke',
    'darden': 'Darden Virginia',
    'johnson': 'Johnson Cornell',
    'anderson': 'Anderson UCLA',
    'sloan': 'MIT Sloan',
    'stern': 'NYU Stern',
    'booth': 'Chicago Booth',
    'tepper': 'Tepper CMU',
    'marshall': 'Marshall USC',
    'foster': 'Foster Washington',
    'mccombs': 'McCombs Texas',
    'kenan-flagler': 'Kenan-Flagler UNC',
    'goizueta': 'Goizueta Emory',
    'mendoza': 'Mendoza Notre Dame',
    'questrom': 'Questrom Boston',
    'kelley': 'Kelley Indiana',
    'fisher': 'Fisher Ohio State',
    'carlson': 'Carlson Minnesota',
    'insead': 'INSEAD',
    'lbs': 'London Business School',
    'iese': 'IESE',
    'imd': 'IMD',
    // Top Universities
    'mit': 'MIT',
    'stanford': 'Stanford',
    'harvard': 'Harvard',
    'berkeley': 'UC Berkeley',
    'ucla': 'UCLA',
    'nyu': 'NYU',
    'columbia': 'Columbia',
    'yale': 'Yale',
    'princeton': 'Princeton',
    'cornell': 'Cornell',
    'upenn': 'UPenn',
    'penn': 'UPenn',
    'brown': 'Brown',
    'dartmouth': 'Dartmouth',
    'duke': 'Duke',
    'northwestern': 'Northwestern',
    'uchicago': 'UChicago',
    'caltech': 'Caltech',
    'cmu': 'Carnegie Mellon',
    'carnegiemellon': 'Carnegie Mellon',
    'gatech': 'Georgia Tech',
    'umich': 'Michigan',
    'usc': 'USC',
    'unc': 'UNC',
    'uva': 'UVA',
    'utexas': 'UT Austin',
    'wisc': 'Wisconsin',
    'uiuc': 'UIUC',
    'purdue': 'Purdue',
    'osu': 'Ohio State',
    'psu': 'Penn State',
    'rutgers': 'Rutgers',
    'bu': 'Boston University',
    'bc': 'Boston College',
    'gwu': 'GWU',
    'georgetown': 'Georgetown',
    'notredame': 'Notre Dame',
    'vanderbilt': 'Vanderbilt',
    'emory': 'Emory',
    'wustl': 'WashU St Louis',
    'rice': 'Rice',
    'tufts': 'Tufts',
    'jhu': 'Johns Hopkins',
    'hopkins': 'Johns Hopkins',
    // Consulting
    'mckinsey': 'McKinsey',
    'bcg': 'BCG',
    'bain': 'Bain',
    'accenture': 'Accenture',
    'booz': 'Booz Allen',
    'boozallen': 'Booz Allen',
    'oliverwyman': 'Oliver Wyman',
    'lek': 'L.E.K. Consulting',
    'rolandberger': 'Roland Berger',
    'strategyand': 'Strategy&',
    'atkearney': 'Kearney',
    'kearney': 'Kearney',
    // Finance / Banking
    'goldmansachs': 'Goldman Sachs',
    'gs': 'Goldman Sachs',
    'jpmorgan': 'JP Morgan',
    'jpm': 'JP Morgan',
    'morganstanley': 'Morgan Stanley',
    'ms': 'Morgan Stanley',
    'blackrock': 'BlackRock',
    'blackstone': 'Blackstone',
    'kkr': 'KKR',
    'carlyle': 'Carlyle',
    'apollo': 'Apollo',
    'tpg': 'TPG',
    'warburg': 'Warburg Pincus',
    'silverlake': 'Silver Lake',
    'vista': 'Vista Equity',
    'thoma': 'Thoma Bravo',
    'sequoia': 'Sequoia',
    'a16z': 'Andreessen Horowitz',
    'greylock': 'Greylock',
    'benchmark': 'Benchmark',
    'accel': 'Accel',
    'kleiner': 'Kleiner Perkins',
    'kpcb': 'Kleiner Perkins',
    'nea': 'NEA',
    'lightspeed': 'Lightspeed',
    'gv': 'Google Ventures',
    'citadel': 'Citadel',
    'twosigma': 'Two Sigma',
    'deshaw': 'D.E. Shaw',
    'renaissance': 'Renaissance',
    'bridgewater': 'Bridgewater',
    'pointseventy': 'Point72',
    'millenium': 'Millennium',
    'balyasny': 'Balyasny',
    'bofa': 'Bank of America',
    'bankofamerica': 'Bank of America',
    'wellsfargo': 'Wells Fargo',
    'citi': 'Citi',
    'citibank': 'Citi',
    'barclays': 'Barclays',
    'ubs': 'UBS',
    'db': 'Deutsche Bank',
    'deutschebank': 'Deutsche Bank',
    'cs': 'Credit Suisse',
    'creditsuisse': 'Credit Suisse',
    'hsbc': 'HSBC',
    'bnp': 'BNP Paribas',
    'bnpparibas': 'BNP Paribas',
    'lazard': 'Lazard',
    'evercore': 'Evercore',
    'moelis': 'Moelis',
    'centerview': 'Centerview',
    'pwp': 'Perella Weinberg',
    'pjt': 'PJT Partners',
    'jefferies': 'Jefferies',
    'cowen': 'TD Cowen',
    'piper': 'Piper Sandler',
    'stifel': 'Stifel',
    'raymondjames': 'Raymond James',
    'baird': 'Baird',
    'rbc': 'RBC',
    'bmo': 'BMO',
    'td': 'TD Bank',
    'scotiabank': 'Scotiabank',
    // Big 4 Accounting
    'deloitte': 'Deloitte',
    'pwc': 'PwC',
    'ey': 'EY',
    'kpmg': 'KPMG',
    'gt': 'Grant Thornton',
    'grantthornton': 'Grant Thornton',
    'bdo': 'BDO',
    'rsm': 'RSM',
    'crowe': 'Crowe',
    // Big Tech
    'google': 'Google',
    'alphabet': 'Google',
    'meta': 'Meta',
    'fb': 'Meta',
    'apple': 'Apple',
    'amazon': 'Amazon',
    'microsoft': 'Microsoft',
    'msft': 'Microsoft',
    'ibm': 'IBM',
    'oracle': 'Oracle',
    'salesforce': 'Salesforce',
    'adobe': 'Adobe',
    'netflix': 'Netflix',
    'nvidia': 'NVIDIA',
    'intel': 'Intel',
    'amd': 'AMD',
    'qualcomm': 'Qualcomm',
    'cisco': 'Cisco',
    'vmware': 'VMware',
    'servicenow': 'ServiceNow',
    'workday': 'Workday',
    'snowflake': 'Snowflake',
    'databricks': 'Databricks',
    'palantir': 'Palantir',
    'stripe': 'Stripe',
    'square': 'Block',
    'block': 'Block',
    'coinbase': 'Coinbase',
    'robinhood': 'Robinhood',
    'plaid': 'Plaid',
    'brex': 'Brex',
    'ramp': 'Ramp',
    'affirm': 'Affirm',
    'klarna': 'Klarna',
    'chime': 'Chime',
    'sofi': 'SoFi',
    'uber': 'Uber',
    'lyft': 'Lyft',
    'airbnb': 'Airbnb',
    'doordash': 'DoorDash',
    'instacart': 'Instacart',
    'spotify': 'Spotify',
    'twitter': 'X',
    'x': 'X',
    'snap': 'Snap',
    'pinterest': 'Pinterest',
    'linkedin': 'LinkedIn',
    'tiktok': 'TikTok',
    'bytedance': 'ByteDance',
    'shopify': 'Shopify',
    'twilio': 'Twilio',
    'zendesk': 'Zendesk',
    'hubspot': 'HubSpot',
    'atlassian': 'Atlassian',
    'slack': 'Slack',
    'zoom': 'Zoom',
    'docusign': 'DocuSign',
    'dropbox': 'Dropbox',
    'notion': 'Notion',
    'figma': 'Figma',
    'canva': 'Canva',
    'asana': 'Asana',
    'monday': 'Monday.com',
    'airtable': 'Airtable',
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'cohere': 'Cohere',
    'stability': 'Stability AI',
    'huggingface': 'Hugging Face',
    'scale': 'Scale AI',
    // Cloud providers
    'aws': 'Amazon AWS',
    'gcp': 'Google Cloud',
    'azure': 'Microsoft Azure',
  };

  // Extract the main domain part (handle subdomains and country TLDs)
  let domainParts = domain.split('.');

  // Remove common TLDs and country codes from the end
  const tlds = ['com', 'co', 'io', 'org', 'net', 'edu', 'gov', 'ai', 'app', 'dev', 'xyz', 'info', 'biz', 'tech', 'club', 'online', 'site', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'in', 'br', 'mx', 'es', 'it', 'nl', 'ch', 'se', 'no', 'dk', 'fi', 'pl', 'ru', 'kr', 'sg', 'hk', 'nz', 'ie', 'at', 'be', 'pt', 'tax', 'law', 'money', 'store', 'shop', 'agency', 'design', 'studio', 'media', 'group', 'team', 'work', 'pro', 'vc', 'fund', 'capital', 'consulting', 'services', 'solutions', 'global', 'world', 'digital', 'marketing', 'finance', 'health', 'legal', 'realty', 'properties', 'ventures'];
  while (domainParts.length > 1 && tlds.includes(domainParts[domainParts.length - 1])) {
    domainParts.pop();
  }

  // If multiple parts remain after TLD removal, keep the FIRST one (main company name)
  // e.g., mail.stanford.edu -> stanford (after edu removed), breeze.tax -> breeze (after tax removed)
  if (domainParts.length > 1) {
    domainParts = [domainParts[0]];
  }

  // Get the main company identifier
  let companyKey = domainParts[0] || '';

  // Check known mappings first
  if (knownMappings[companyKey]) {
    return knownMappings[companyKey];
  }

  // Smart splitting for camelCase or concatenated words
  let company = companyKey
    // Insert space before capital letters (camelCase)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace hyphens and underscores with spaces
    .replace(/[-_]/g, ' ')
    // Remove numbers
    .replace(/\\d+/g, '')
    .trim();

  // If it's a short acronym (2-4 chars, no vowels or all caps pattern), keep uppercase
  if (company.length <= 4 && !/[aeiou]/i.test(company)) {
    return company.toUpperCase();
  }

  // Capitalize each word
  company = company.split(' ')
    .filter(word => word.length > 0)
    .map(word => {
      // Keep short words (likely acronyms) uppercase
      if (word.length <= 3 && !/[aeiou]/i.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');

  return company || '';
}

/**
 * Formats a name from an email address (fallback when name not available)
 * Handles patterns like: john.smith, jsmith, smithj, j.smith, john_smith, johnsmith
 */
function formatNameFromEmail(email) {
  if (!email) return 'Unknown';

  let localPart = email.split('@')[0].toLowerCase();

  // Remove common prefixes/suffixes that aren't names
  localPart = localPart.replace(/^(info|contact|hello|admin|support|sales|team|help)$/i, '');
  if (!localPart) return 'Unknown';

  // Remove numbers
  localPart = localPart.replace(/\\d+/g, '');

  // If it has dots or underscores, split on them (preserve hyphens for hyphenated names)
  if (/[._]/.test(localPart)) {
    const parts = localPart.split(/[._]+/).filter(p => p.length > 0);

    // Check if any part is a single letter (likely an initial)
    const expanded = parts.map(part => {
      if (part.length === 1) {
        return part.toUpperCase();
      }
      // Preserve and capitalize hyphenated parts (e.g., smith-jones -> Smith-Jones)
      if (part.includes('-')) {
        return part.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('-');
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    });

    return expanded.join(' ').trim() || 'Unknown';
  }

  // Try to split camelCase (rare but possible): JohnSmith
  const camelSplit = localPart.replace(/([a-z])([A-Z])/g, '$1 $2');
  if (camelSplit.includes(' ')) {
    return camelSplit.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Try to detect first+last concatenated using common first names
  // This handles emails like "willvalori" -> "Will Valori"
  // Name sources: US Census 2000s data, dariusk/corpora (github.com/dariusk/corpora)
  // Indian names: balasahebgulave/Dataset-indian-names
  // Spanish names: github.com/dariusk/corpora/data/humans/spanishFirstNames.json
  const commonFirstNames = [
    // American/English names
    'will', 'william', 'john', 'james', 'michael', 'david', 'chris', 'christopher', 'matt', 'matthew',
    'mike', 'dan', 'daniel', 'tom', 'thomas', 'steve', 'steven', 'mark', 'paul', 'brian',
    'kevin', 'jason', 'jeff', 'jeffrey', 'eric', 'andrew', 'josh', 'joshua', 'ryan', 'nick',
    'nicholas', 'alex', 'alexander', 'adam', 'ben', 'benjamin', 'joe', 'joseph', 'sam', 'samuel',
    'rob', 'robert', 'bob', 'bill', 'tim', 'timothy', 'jim', 'tony', 'anthony', 'peter',
    'scott', 'greg', 'gregory', 'gary', 'larry', 'lawrence', 'jerry', 'gerald', 'sean', 'patrick',
    'jack', 'jake', 'jacob', 'luke', 'evan', 'tyler', 'brandon', 'justin', 'aaron', 'jonathan',
    'nathan', 'kyle', 'austin', 'jordan', 'dylan', 'ethan', 'noah', 'logan', 'mason', 'liam',
    'mary', 'lisa', 'sarah', 'jennifer', 'jessica', 'ashley', 'amanda', 'nicole', 'melissa',
    'stephanie', 'michelle', 'elizabeth', 'heather', 'rachel', 'laura', 'anna', 'kate', 'katherine',
    'emily', 'emma', 'amy', 'kim', 'kimberly', 'susan', 'linda', 'karen', 'nancy', 'betty',
    'helen', 'sandra', 'donna', 'carol', 'ruth', 'sharon', 'patricia', 'barbara', 'deborah',
    'christine', 'catherine', 'diane', 'julie', 'kelly', 'maria', 'angela', 'pamela', 'brenda',
    'janet', 'tiffany', 'andrea', 'kathleen', 'ann', 'anne', 'jane', 'denise', 'rebecca', 'sara',
    'natalie', 'megan', 'morgan', 'hannah', 'olivia', 'sophia', 'victoria', 'grace', 'madison',
    'chloe', 'abigail', 'ella', 'ava', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn',
    // Indian names
    'rahul', 'amit', 'priya', 'neha', 'raj', 'ravi', 'sanjay', 'vijay', 'ajay', 'suresh',
    'ramesh', 'anil', 'sunil', 'deepak', 'rakesh', 'mukesh', 'arun', 'vivek', 'anand', 'vikram',
    'sachin', 'nitin', 'rohit', 'mohit', 'gaurav', 'varun', 'karan', 'arjun', 'vishal', 'akash',
    'ashish', 'manish', 'rajesh', 'dinesh', 'ganesh', 'mahesh', 'naresh', 'lokesh', 'ritesh',
    'pooja', 'sneha', 'anita', 'sunita', 'kavita', 'meena', 'seema', 'reena', 'nisha', 'ritu',
    'swati', 'preeti', 'shweta', 'ankita', 'nikita', 'namita', 'smita', 'jyoti', 'aarti', 'shruti',
    'divya', 'megha', 'pallavi', 'manisha', 'shalini', 'rashmi', 'sapna', 'komal', 'kajal',
    'aishwarya', 'lakshmi', 'durga', 'radha', 'sita', 'gita', 'uma', 'rani', 'rekha',
    // Chinese names (romanized)
    'wei', 'fang', 'ming', 'lei', 'jing', 'ying', 'xiao', 'hong', 'yan', 'ping',
    'chen', 'wang', 'zhang', 'zhao', 'huang', 'zhou', 'yang', 'lin', 'liu', 'sun',
    // Spanish/Latin names
    'jose', 'juan', 'carlos', 'luis', 'miguel', 'jorge', 'pedro', 'jesus', 'manuel', 'francisco',
    'antonio', 'alejandro', 'fernando', 'ricardo', 'eduardo', 'sergio', 'pablo', 'andres', 'diego',
    'carmen', 'rosa', 'ana', 'lucia', 'elena', 'isabel', 'sofia', 'paula', 'marta', 'raquel',
    'alba', 'silvia', 'beatriz', 'cristina', 'monica', 'pilar', 'teresa',
    // Arabic names
    'mohamed', 'mohammed', 'ahmad', 'ahmed', 'ali', 'omar', 'hassan', 'hussein', 'khalid', 'tariq',
    'youssef', 'mustafa', 'karim', 'nour', 'fatima', 'aisha', 'layla', 'mariam', 'yasmin',
    // European names
    'hans', 'franz', 'klaus', 'wolfgang', 'stefan', 'andreas', 'markus', 'tobias', 'florian',
    'pierre', 'jean', 'olivier', 'nicolas', 'philippe', 'laurent', 'guillaume', 'vincent',
    'marco', 'luca', 'matteo', 'giuseppe', 'giovanni', 'lorenzo', 'alessandro', 'francesco',
    'jan', 'piotr', 'tomasz', 'andrzej', 'krzysztof', 'pawel', 'michal',
    'ivan', 'sergei', 'dmitri', 'alexei', 'mikhail', 'vladimir', 'nikolai', 'boris', 'oleg'
  ];

  for (const firstName of commonFirstNames) {
    if (localPart.startsWith(firstName) && localPart.length > firstName.length + 2) {
      const remainder = localPart.slice(firstName.length);
      const formattedFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const formattedLast = remainder.charAt(0).toUpperCase() + remainder.slice(1);
      return \`\${formattedFirst} \${formattedLast}\`;
    }
  }

  // Last resort: just capitalize what we have
  // But if it's very short (< 4 chars), it's probably not a full name
  if (localPart.length < 4) {
    return localPart.toUpperCase(); // Treat as initials
  }

  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

// ============================================================================
// TRIGGER FUNCTIONS
// ============================================================================

/**
 * Sets up the weekly trigger for Saturday at 3am (Friday night)
 */
function setupWeeklyTrigger() {
  // Remove existing triggers first
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'main') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new weekly trigger
  ScriptApp.newTrigger('main')
    .timeBased()
    .onWeekDay(CONFIG.TRIGGER_DAY)
    .atHour(CONFIG.TRIGGER_HOUR)
    .create();

  Logger.log(\`✅ Weekly trigger set for \${CONFIG.TRIGGER_DAY} at \${CONFIG.TRIGGER_HOUR}:00\`);
}

// ============================================================================
// MENU FUNCTIONS
// ============================================================================

/**
 * Creates custom menu in the spreadsheet
 */
function createMenu() {
  const spreadsheet = getSpreadsheet();
  if (!spreadsheet) return;

  spreadsheet.addMenu('AutoLink', [
    { name: '🔄 Run Now', functionName: 'runNow' },
    { name: '📊 View Logs', functionName: 'viewLogs' },
    null, // Separator
    { name: '⚙️ Recreate Trigger', functionName: 'setupWeeklyTrigger' },
  ]);
}

/**
 * Auto-create menu when spreadsheet opens
 */
function onOpen() {
  createMenu();
}

/**
 * Opens the Apps Script logs
 */
function viewLogs() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'View Logs',
    'To view execution logs:\\n\\n' +
    '1. Go to script.google.com\\n' +
    '2. Open this project\\n' +
    '3. Click "Executions" in the left sidebar\\n\\n' +
    'Or press Ctrl+Enter in the script editor after running a function.',
    ui.ButtonSet.OK
  );
}`
}
