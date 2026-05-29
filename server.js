require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your React app to communicate with this server
app.use(express.json()); // Parses incoming JSON payloads

// --- SAP Configuration ---
const SAP_BASE_URL = process.env.SAP_ODATA_URL;

// Create an Axios instance pre-configured with SAP authentication and headers
const sapClient = axios.create({
  baseURL: SAP_BASE_URL,
  headers: {
    'Authorization': `Basic ${Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// --- Helper: Fetch CSRF Token ---
// SAP requires an X-CSRF-Token for any POST/PUT/PATCH requests to prevent cross-site request forgery.
async function getSapCsrfToken() {
  try {
    const response = await sapClient.get('/', {
      headers: { 'X-CSRF-Token': 'Fetch' }
    });
    return {
      token: response.headers['x-csrf-token'],
      cookies: response.headers['set-cookie']
    };
  } catch (error) {
    console.error('Failed to fetch CSRF Token from SAP:', error.message);
    throw error;
  }
}

// ==========================================
// API ENDPOINTS FOR REACT FRONTEND
// ==========================================

/**
 * 1. GET /api/work-orders
 * Fetches uncompleted Work Orders from SAP to populate the OptiSchedule baseline.
 */
app.get('/api/work-orders', async (req, res) => {
  try {
    // We use OData query parameters to filter for specific statuses (e.g., 'REL' = Released)
    // and select only the fields OptiSchedule needs to minimize bandwidth.
    const odataQuery = `/WorkOrderSet?$filter=SystemStatus eq 'REL'&$select=OrderNumber,Description,BasicStartDate,BasicEndDate,WorkCenter,EstimatedLaborHours`;
    
    const sapResponse = await sapClient.get(odataQuery);
    
    // Extract the raw array of work orders from the SAP OData format
    const workOrders = sapResponse.data.d.results;
    
    res.status(200).json({
      message: 'Successfully retrieved SAP data',
      count: workOrders.length,
      data: workOrders
    });

  } catch (error) {
    console.error('SAP Fetch Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to retrieve Work Orders from SAP' });
  }
});

/**
 * 2. PATCH /api/work-orders/:orderId
 * Pushes the AI-Optimized start and end dates back to the SAP system.
 */
app.patch('/api/work-orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { optimizedStartDate, optimizedEndDate } = req.body;

  // Validate and constrain user input before using it in outbound URL construction
  // Adjust pattern if your SAP order IDs support a different fixed format.
  const isValidOrderId = /^[0-9]{1,20}$/.test(orderId);
  if (!isValidOrderId) {
    return res.status(400).json({ error: 'Invalid work order id format.' });
  }

  // Encode defensively before interpolation into OData entity key path
  const safeOrderId = encodeURIComponent(orderId);

  try {
    // 1. First, we must fetch a fresh CSRF token and session cookies
    const { token, cookies } = await getSapCsrfToken();

    // 2. Format the payload exactly how the SAP PM BAPI expects it
    const updatePayload = {
      BasicStartDate: optimizedStartDate,
      BasicEndDate: optimizedEndDate,
      // Any additional fields required by your specific SAP implementation
    };

    // 3. Send the PATCH request to the specific Work Order entity
    const sapResponse = await sapClient.patch(
      `/WorkOrderSet('${safeOrderId}')`, 
      updatePayload,
      {
        headers: {
          'X-CSRF-Token': token,
          'Cookie': cookies.join('; ') // Attach session cookies
        }
      }
    );

    res.status(200).json({
      message: `Work Order ${orderId} successfully updated with AI optimized schedule.`,
      sapStatus: sapResponse.status
    });

  } catch (error) {
    console.error('SAP Update Error for Order %s:', orderId, error?.response?.data || error?.message || error);
    res.status(500).json({ error: `Failed to update Work Order ${orderId} in SAP` });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`OptiSchedule Enterprise Middleware running on port ${PORT}`);
  console.log(`Ready to sync with SAP PM OData Services...`);
});
