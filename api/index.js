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

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Stallion Asset POC Backend Running');
});

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

module.exports = app;
