import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing with safe size limit
app.use(express.json({ limit: '100kb' }));

// In-memory rate limiting to protect public ad endpoints (15 submissions / 10 min per IP)
const submissionRateMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = submissionRateMap.get(ip);
  if (!entry || now > entry.resetTime) {
    submissionRateMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Clean old rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of submissionRateMap.entries()) {
    if (now > entry.resetTime) {
      submissionRateMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

// Helper to sanitize and normalize phone numbers for Twenty "Phones" field
function parsePhoneNumber(rawMobile: string) {
  const cleaned = rawMobile.trim().replace(/[^\d+]/g, '');
  let callingCode = '+91';
  let countryCode = 'IN';
  let phoneNumber = cleaned;

  if (cleaned.startsWith('+91')) {
    callingCode = '+91';
    countryCode = 'IN';
    phoneNumber = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    callingCode = '+91';
    countryCode = 'IN';
    phoneNumber = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    callingCode = '+91';
    countryCode = 'IN';
    phoneNumber = cleaned.slice(1);
  } else if (cleaned.startsWith('+')) {
    // Other international formats if supplied
    const match = cleaned.match(/^(\+\d{1,4})(\d{6,14})$/);
    if (match) {
      callingCode = match[1];
      countryCode = 'INTL';
      phoneNumber = match[2];
    }
  }

  return {
    callingCode,
    countryCode,
    phoneNumber,
  };
}

// Email validator regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cache for introspected Twenty metadata fields
let cachedTwentyFields: Record<string, string> | null = null;
let metadataFetched = false;

async function introspectTwentyMetadata(baseUrl: string, apiKey: string) {
  if (metadataFetched) return cachedTwentyFields;
  metadataFetched = true;
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/rest/metadata/objects`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as {
      data?: { objects?: Array<{ nameSingular?: string; namePlural?: string; fields?: Array<{ name: string; type: string; label?: string }> }> };
      objects?: Array<{ nameSingular?: string; namePlural?: string; fields?: Array<{ name: string; type: string; label?: string }> }>;
    };

    const objects = json?.data?.objects || json?.objects || [];
    const targetObj = objects.find((o) => {
      const singular = (o.nameSingular || '').toLowerCase();
      const plural = (o.namePlural || '').toLowerCase();
      return (
        singular === 'dentallandingpageadform' ||
        plural === 'dentallandingpageadforms' ||
        singular.includes('dentallandingpage') ||
        plural.includes('dentallandingpage')
      );
    });

    if (targetObj && Array.isArray(targetObj.fields)) {
      const mapping: Record<string, string> = {};
      for (const field of targetObj.fields) {
        const type = (field.type || '').toUpperCase();
        const name = field.name;
        const label = (field.label || '').toLowerCase();

        if (type === 'EMAILS' || label.includes('email')) {
          mapping.email = name;
        } else if (type === 'PHONES' || label.includes('mobile') || label.includes('phone')) {
          mapping.mobile = name;
        } else if (label.includes('name') && !mapping.name) {
          mapping.name = name;
        } else if (label.includes('note') || label.includes('message')) {
          mapping.note = name;
        }
      }
      cachedTwentyFields = mapping;
      return cachedTwentyFields;
    }
  } catch (err) {
    console.warn('[Twenty CRM] Metadata introspection skipped or failed:', err);
  }
  return null;
}

/**
 * Lead Games B2B Enquiry Submission Endpoint
 * Receives: name, mobile, email, note, source, pageUrl, referrer, utm*
 * Dispatches to Twenty CRM custom object: /rest/dentallandingpageadforms
 */
app.post('/api/lead-games-enquiry', async (req: Request, res: Response): Promise<void> => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      success: false,
      error: 'Too many submissions. Please wait a few moments before trying again.',
    });
    return;
  }

  const {
    name,
    mobile,
    email,
    note,
    source,
    pageUrl,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  } = req.body || {};

  // 1. Server-side validation
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
    res.status(400).json({ success: false, error: 'Please enter a valid name (2-120 characters).' });
    return;
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 150) {
    res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    return;
  }

  if (!mobile || typeof mobile !== 'string' || mobile.trim().length < 8 || mobile.trim().length > 25) {
    res.status(400).json({ success: false, error: 'Please enter a valid mobile number.' });
    return;
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMobile = mobile.trim();
  const trimmedNote = typeof note === 'string' ? note.trim().slice(0, 2000) : '';

  // 2. Check Twenty CRM environment variables
  const twentyBaseUrl = (process.env.TWENTY_BASE_URL || '').trim().replace(/\/+$/, '');
  const twentyApiKey = (process.env.TWENTY_API_KEY || '').trim();

  if (!twentyBaseUrl || !twentyApiKey) {
    console.error('[Twenty CRM Error] Missing TWENTY_BASE_URL or TWENTY_API_KEY environment variables on server.');
    res.status(503).json({
      success: false,
      error: 'We couldn’t submit your enquiry right now. Please try again.',
      code: 'CRM_CONFIG_MISSING',
    });
    return;
  }

  // 3. Prepare Twenty CRM field structures
  const phoneData = parsePhoneNumber(trimmedMobile);

  // Field names can be configured via environment variables or introspected
  const introspected = await introspectTwentyMetadata(twentyBaseUrl, twentyApiKey);

  const nameFieldName = process.env.TWENTY_FIELD_NAME || introspected?.name || 'name';
  const emailFieldName = process.env.TWENTY_FIELD_EMAIL || introspected?.email || 'email';
  const mobileFieldName = process.env.TWENTY_FIELD_MOBILE || introspected?.mobile || 'mobile';
  const noteFieldName = process.env.TWENTY_FIELD_NOTE || introspected?.note || 'note';

  // Construct Twenty CRM composite structures
  const emailPayload = {
    primaryEmail: trimmedEmail,
    additionalEmails: [],
  };

  const phonePayload = {
    primaryPhoneNumber: phoneData.phoneNumber,
    primaryPhoneCountryCode: phoneData.countryCode,
    primaryPhoneCallingCode: phoneData.callingCode,
    additionalPhones: [],
  };

  // Build candidate payload
  const twentyPayload: Record<string, unknown> = {
    [nameFieldName]: trimmedName,
    [emailFieldName]: emailPayload,
    [mobileFieldName]: phonePayload,
  };

  if (trimmedNote) {
    twentyPayload[noteFieldName] = trimmedNote;
  }

  const targetEndpoint = `${twentyBaseUrl}/rest/dentallandingpageadforms`;

  console.info(`[Twenty CRM] Sending enquiry to ${targetEndpoint}...`);

  try {
    let response = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${twentyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(twentyPayload),
    });

    // If Twenty returns 400 Bad Request indicating a potential field name alternative
    // (e.g. Twenty custom objects using 'emails' instead of 'email', or 'phones' instead of 'mobile')
    if (response.status === 400) {
      const errText = await response.text();
      console.warn('[Twenty CRM 400 Warning]', errText);

      let shouldRetry = false;
      const retryPayload = { ...twentyPayload };

      // Check if error suggests 'emails' vs 'email'
      if (errText.includes('emails') && emailFieldName === 'email') {
        delete retryPayload.email;
        retryPayload.emails = emailPayload;
        shouldRetry = true;
      } else if (errText.includes('email') && emailFieldName === 'emails') {
        delete retryPayload.emails;
        retryPayload.email = emailPayload;
        shouldRetry = true;
      }

      // Check if error suggests 'phones' vs 'mobile'
      if (errText.includes('phones') && mobileFieldName === 'mobile') {
        delete retryPayload.mobile;
        retryPayload.phones = phonePayload;
        shouldRetry = true;
      } else if (errText.includes('mobile') && mobileFieldName === 'phones') {
        delete retryPayload.phones;
        retryPayload.mobile = phonePayload;
        shouldRetry = true;
      }

      if (shouldRetry) {
        console.info('[Twenty CRM] Retrying with alternative field names...', Object.keys(retryPayload));
        response = await fetch(targetEndpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${twentyApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(retryPayload),
        });
      }
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(`[Twenty CRM Error] Status: ${response.status}`, errorBody);
      res.status(502).json({
        success: false,
        error: "We couldn't submit your enquiry right now. Please try again.",
      });
      return;
    }

    const responseData = (await response.json()) as { data?: { id?: string }; id?: string };
    const recordId = responseData?.data?.id || responseData?.id || 'created';

    console.info(`[Twenty CRM Success] Record created with ID: ${recordId}`);

    res.status(200).json({
      success: true,
      recordId,
    });
  } catch (err) {
    console.error('[Twenty CRM Network Error]', err);
    res.status(500).json({
      success: false,
      error: "We couldn't submit your enquiry right now. Please try again.",
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
