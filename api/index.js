// const express = require('express');
// const cors = require('cors');

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Health check (optional but good)
// app.get('/', (req, res) => {
//   res.send('Stallion Asset POC Backend Running');
// });

// app.post('/submit', (req, res) => {
//   const {
//     investorType,
//     name,
//     pan,
//     email,
//     mobile,
//     plan
//   } = req.body;

//   // ---- Basic required checks ----
//   if (!investorType || !name || !pan || !email || !mobile || !plan) {
//     return res.status(400).json({
//       success: false,
//       code: 'MISSING_FIELDS',
//       message: 'All fields are required'
//     });
//   }

//   // ---- PAN Validation (India) ----
//   // Format: ABCDE1234F
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//   if (!panRegex.test(pan)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_PAN',
//       message: 'PAN is not valid (format: ABCDE1234F)'
//     });
//   }

//   // ---- Mobile Validation (India) ----
//   const mobileRegex = /^[6-9]\d{9}$/;
//   if (!mobileRegex.test(mobile)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_MOBILE',
//       message: 'Mobile number must be 10 digits starting with 6-9'
//     });
//   }

//   // ---- Email Validation ----
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_EMAIL',
//       message: 'Email address is not valid'
//     });
//   }

//   // ---- Plan Validation ----
//   if (!['PLAN_A', 'PLAN_B'].includes(plan)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_PLAN',
//       message: 'Invalid PMS plan selected'
//     });
//   }

//   // ---- SUCCESS RESPONSE ----
//   return res.status(200).json({
//     success: true,
//     code: 'SUCCESS',
//     message: 'Onboarding submitted successfully (POC)',
//     data: {
//       investorType,
//       name,
//       pan,
//       email,
//       mobile,
//       plan
//     }
//   });
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Stallion POC backend running on http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAQpEBb62U_5znrQRhEKYWKFPDIyHYFCd8"
});


const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/* ================================
   STALLION CONTEXT (EMBEDDED)
================================ */
const STALLION_CONTEXT = {
  company: {
    name: "Stallion Asset Private Limited",
    sebi_registration: "INP000006129",
    cin: "U65990MH2018PTC305551",
    business: "SEBI Registered Portfolio Management Service (PMS)",
    years_in_business: 7,
    aum: "₹6,500+ Crores",
    families_served: "5,500+",
    headquarters: {
      address: "5th Floor, Jet Prime Building, Suren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093"
    }
  },

  leadership: {
    founder_cio: {
      name: "Amit Jeswani",
      role: "Founder & Chief Investment Officer",
      experience_years: 14,
      qualifications: [
        "Chartered Financial Analyst (CFA), Virginia, USA",
        "Chartered Market Technician (CMT), New York, USA",
        "Business Graduate – Finance, Kingston University London"
      ],
      investment_belief:
        "Investing in high-growth consumer-facing companies that can grow 2–3x faster than the Indian economy"
    }
  },

  pms: {
    product_name: "Stallion Asset Core Fund",
    category: "Multi-cap",
    minimum_investment: "₹50,00,000",
    strategy_inception_date: "22-Oct-2018",
    benchmark: "S&P BSE500 TRI",
    bankers: "IndusInd Bank",
    custodian: "Nuvama Custodial Services Limited",
    auditors: "Aneel Lasod and Associates",

    performance: {
      twrr_since_inception: "29.42%",
      value_of_100_at_launch: {
        stallion_core_fund: "₹625.55",
        benchmark_bse500: "₹298.53"
      },
      performance_note:
        "Performance is calculated using Time Weighted Rate of Return (TWRR). Past performance is not indicative of future results."
    },

    fee_structure: {
      PLAN_A: "1.5% fixed fee + 15% profit sharing over 10% hurdle rate",
      PLAN_B: "2.5% fixed fee with no profit sharing"
    },

    onboarding: {
      modes: ["Direct onboarding without distributor"],
      timeline: "1–2 working days after document verification",
      contact_email: "pms@stallionasset.com"
    },

    eligible_investors: [
      "Resident Individuals",
      "HUF",
      "Body Corporates",
      "Trusts",
      "NRIs",
      "Partnership Firms"
    ]
  },

  investment_philosophy: {
    core_framework: "4 M’s of Investing",
    pillars: [
      "Market Leadership",
      "Market Opportunity",
      "Management Quality",
      "Margin of Safety"
    ],
    sectors_focus: [
      "Consumer Discretionary",
      "Financials",
      "Consumer Technology",
      "Pharma"
    ],
    approach:
      "Growth-oriented investing focused on high-quality companies capable of outpacing India’s GDP growth over long periods"
  },

  team: [
    { name: "Rohit Jeswani", role: "Compliance Officer" },
    { name: "Juhi Shah", role: "Senior Research Analyst" },
    { name: "Arpit Shah", role: "Fund Manager" },
    { name: "Behzad Kalantary", role: "Head of Sales" }
  ],

  compliance: {
    grievance_officer: {
      name: "Rohit Jeswani",
      email: "rohitjeswani@stallionasset.com",
      phone: "+91 9820045008"
    },
    support_email: "support@stallionasset.com",
    sebi_scores:
      "https://scores.sebi.gov.in",
    odr_portal:
      "https://smartodr.sebi.gov.in"
  },

  allowed_pages: {
    home: "/",
    about: "/about-us",
    pms_performance: "/pms-performance",
    investment_philosophy: "/investment-philosophy",
    contact: "/contact",
    onboarding: "/onboarding",
    disclosures: "/disclosures"
  },

  strict_rules: {
    no_stock_tips: true,
    no_return_guarantees: true,
    no_future_predictions: true,
    pms_disclaimer_required: true
  }
};


/* ================================
   HEALTH CHECK
================================ */
app.get('/heath', (req, res) => {
  res.send('Stallion Asset POC Backend Running');
});

/* ================================
   EXISTING SUBMIT API (UNCHANGED)
================================ */
app.post('/submit', (req, res) => {
  const { investorType, name, pan, email, mobile, plan } = req.body;

  if (!investorType || !name || !pan || !email || !mobile || !plan) {
    return res.status(400).json({
      success: false,
      code: 'MISSING_FIELDS',
      message: 'All fields are required'
    });
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(pan)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_PAN',
      message: 'Invalid PAN format'
    });
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_MOBILE',
      message: 'Invalid mobile number'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_EMAIL',
      message: 'Invalid email'
    });
  }

  if (!['PLAN_A', 'PLAN_B'].includes(plan)) {
    return res.status(400).json({
      success: false,
      code: 'INVALID_PLAN',
      message: 'Invalid PMS plan'
    });
  }

  return res.json({
    success: true,
    message: 'Onboarding submitted successfully (POC)',
    data: req.body
  });
});

/* ================================
   CHATBOT API (GEMINI + CONTEXT LOCK)
================================ */
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemPrompt = `
You are Stallion Asset AI Assistant. So give answers like a chatbot not one word answers

STRICT RULES:
1. Answer ONLY from the CONTEXT below.
2. If question is outside context, reply EXACTLY:
   "I can help only with Stallion Asset PMS related information."
3. If user intent is navigation, return ONLY valid JSON like:
   { "action": "REDIRECT", "url": "/onboarding" }
4. Never guess, never add extra info.

CONTEXT:
${JSON.stringify(STALLION_CONTEXT)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: message }
          ]
        }
      ]
    });

    const reply = response.text.trim();

    // Handle redirect JSON
    if (reply.startsWith('{')) {
      return res.json(JSON.parse(reply));
    }

    return res.json({ reply });

  } catch (err) {
    console.error('Chatbot error:', err);
    return res.status(500).json({ error: 'Chatbot failed' });
  }
});


/* ================================
   START SERVER
================================ */
module.exports = app;




// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Stallion Asset POC Backend Running');
// });

// app.post('/submit', (req, res) => {
//   const { investorType, name, pan, email, mobile, plan } = req.body;

//   if (!investorType || !name || !pan || !email || !mobile || !plan) {
//     return res.status(400).json({
//       success: false,
//       code: 'MISSING_FIELDS',
//       message: 'All fields are required'
//     });
//   }

//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
//   if (!panRegex.test(pan)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_PAN',
//       message: 'Invalid PAN format'
//     });
//   }

//   const mobileRegex = /^[6-9]\d{9}$/;
//   if (!mobileRegex.test(mobile)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_MOBILE',
//       message: 'Invalid mobile number'
//     });
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_EMAIL',
//       message: 'Invalid email'
//     });
//   }

//   if (!['PLAN_A', 'PLAN_B'].includes(plan)) {
//     return res.status(400).json({
//       success: false,
//       code: 'INVALID_PLAN',
//       message: 'Invalid PMS plan'
//     });
//   }

//   return res.json({
//     success: true,
//     message: 'Onboarding submitted successfully (POC)',
//     data: req.body
//   });
// });

// module.exports = app;
