1. Project Overview
AI-Powered Automated Lead Qualification and Routing System is an AI-powered web application that automatically processes incoming customer inquiries, extracts important business information using Gemini, qualifies leads based on predefined budget rules, and routes them to the appropriate sales category.

The system eliminates manual lead-processing tasks such as reading emails, identifying customer budgets, summarizing requirements, categorizing leads, and entering information into spreadsheets.

The objective is to design, develop, test, and deploy a complete lead-management application that converts unstructured customer messages into structured, qualified, and searchable sales records.
2. Phase 1: Create a Detailed Spec Sheet
Before writing any code, create a SPEC.md file. This document serves as the blueprint for the entire project and guides AI coding tools such as Codex through implementation.
A. Project Requirements
Document the following:
- Project overview and problem statement.
- Target users and expected user experience.
- Core features and optional enhancements.
- Technology stack: React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, and Gemini API.
- Project limitations and final deliverables.
Core Features:
1. Customer inquiry submission through a web form.
2. AI-based extraction of lead information.
3. Automatic budget-based lead qualification.
4. Rule-based lead routing.
5. MongoDB storage of processed leads.
6. Dashboard to view and filter leads.
7. Enterprise lead management view.
Target Users:
- Sales representatives.
- Sales managers.
- Enterprise sales executives.
- Business development teams.
- Company administrators.
B. User Flow
Document the complete application journey:
1. User opens the website.
2. User accesses the lead submission form.
3. User enters their company name, contact information, and inquiry message.
4. The frontend sends the information to the Express backend.
5. Gemini analyzes the unstructured message and extracts structured information.
6. The backend validates the extracted data.
7. The backend applies predefined business rules to classify the lead.
8. The processed lead is stored in MongoDB.
9. The dashboard displays the newly processed lead.
10. The sales director accesses the enterprise leads section to view high-value opportunities.
11. The general sales team accesses all leads through the main dashboard.
C. UI and Page Specifications
Define the purpose and essential elements of each page.

1. Home / Landing Page

Purpose: Introduce the application and explain its functionality.

Essential elements:
- Project name and logo.
- Short project description.
- Start processing / Submit Lead button.
- Overview of the lead qualification process.
- Navigation to the dashboard.
2. Lead Submission Page

Purpose: Allow prospective customers or employees to submit customer inquiries.

Essential elements:
- Company name input (optional if extracted from the message).
- Contact name.
- Email address.
- Inquiry message textarea.
- Submit button.
- Form validation messages.
3. Processing Page / Loading State

Purpose: Inform the user that the inquiry is being analyzed.

Essential elements:
- Processing animation.
- AI analysis status.
- Lead extraction progress.
- Success or failure message.
4. Sales Dashboard

Purpose: Display all processed customer inquiries.

Essential elements:
- Total leads.
- Enterprise leads count.
- Unqualified leads count.
- High-urgency leads count.
- Lead records table.
- Search and filtering functionality.
- Lead status indicators.
5. Enterprise Leads Page

Purpose: Display only high-value leads that qualify for enterprise sales handling.

Essential elements:
- Enterprise lead list.
- Company name.
- Estimated budget.
- Urgency.
- Summary.
- Routing status.
- Lead creation date.
6. Lead Details Page

Purpose: Display the complete information about an individual lead.

Essential elements:
- Original customer message.
- Extracted company information.
- Estimated budget.
- Urgency level.
- AI-generated summary.
- Qualification tier.
- Routing status.
- Timestamp.
UI Requirements:
- Use a modern SaaS dashboard design.
- Implement responsive layouts for desktop, tablet, and mobile.
- Use clear visual indicators for lead priority.
- Include loading, empty, success, and error states.
- Maintain consistent navigation across pages.
Students may use Stitch AI to generate an initial UI design and document how each screen maps to the project requirements.
D. Backend and Database Design
Document the API endpoints, request and response formats, validation rules, and error handling.

Suggested API Endpoints:
Method	Endpoint	Purpose
POST	/api/leads	Submit and process a new lead
GET	/api/leads	Retrieve all leads
GET	/api/leads/enterprise	Retrieve enterprise-qualified leads
GET	/api/leads/:id	Retrieve an individual lead
GET	/api/leads/stats	Retrieve dashboard statistics

POST /api/leads — Sample Request:
{
  "contactName": "Sarah",
  "email": "sarah@cloudscale.com",
  "rawText": "We are a team of 85 experiencing database latency. Our budget is $18,000 and we need a solution before next month."
}


Sample Processed Response:
{
  "success": true,
  "lead": {
    "companyName": "CloudScale Inc",
    "estimatedBudget": 18000,
    "currency": "USD",
    "urgency": "HIGH",
    "tier": "ENTERPRISE",
    "routingStatus": "ASSIGNED_ACCOUNT_EXEC",
    "summary": "Experiencing severe database latency and requires implementation within a month."
  }
}


Database Design:

Use MongoDB with Mongoose to create a Lead model.

Suggested database fields:
Field	Data Type	Description
contactName	String	Customer contact name
email	String	Customer email address
rawText	String	Original customer inquiry
companyName	String	Extracted company name
estimatedBudget	Number	Extracted budget
currency	String	Budget currency
urgency	String	HIGH / MEDIUM / LOW / UNKNOWN
summary	String	AI-generated inquiry summary
tier	String	ENTERPRISE / UNQUALIFIED
routingStatus	String	Assigned sales category
createdAt	Date	Lead creation timestamp

Security Requirements:
- Keep Gemini API keys in backend environment variables.
- Never expose API keys in frontend code.
- Validate all incoming requests.
- Validate Gemini responses before database insertion.
- Use Mongoose validation for database fields.
- Configure CORS to allow only approved frontend origins.
- Protect dashboard and lead-management endpoints with authentication before production deployment.
- Never trust AI-generated qualification or routing decisions; calculate them on the backend.
E. AI Behavior and Lead Qualification Rules
Specify the expected Gemini output format and validate generated responses before saving them.

Gemini AI Responsibilities:

Gemini 2.5 Flash must act as a structured information extractor rather than a conversational chatbot.

It should extract four primary fields:
1. Company Name.
2. Estimated Budget.
3. Urgency Level.
4. Inquiry Summary.
Expected AI Output:
{
  "companyName": "CloudScale Inc",
  "estimatedBudget": 18000,
  "currency": "USD",
  "urgency": "HIGH",
  "summary": "Experiencing severe database latency and requires implementation within a month."
}


Urgency Classification:
Urgency	Description
HIGH	Customer requires an immediate or time-sensitive solution
MEDIUM	Customer has a defined requirement but a flexible timeline
LOW	Customer is exploring options without immediate requirements
UNKNOWN	Insufficient information to determine urgency

Lead Qualification Rules:

The backend must apply deterministic business rules after Gemini extraction.
Budget	Lead Tier	Routing Status
$10,000 or above	ENTERPRISE	ASSIGNED_ACCOUNT_EXEC
Below $10,000	UNQUALIFIED	AUTO_NURTURE
Missing / Invalid	NEEDS_REVIEW	MANUAL_REVIEW

The threshold and currency must be configurable. Do not compare different currencies without converting them to a common currency.

Scoring and Priority Rules:

For the initial MVP, use lead classification rather than an AI-generated score.
- Enterprise leads receive high-value classification.
- High-urgency leads receive immediate attention.
- Medium-urgency leads receive normal follow-up.
- Low-urgency leads remain in the nurture pipeline.
- Missing or ambiguous budget information is sent for manual review.
Important: Gemini must never decide the final lead tier or routing status. These decisions must be performed using backend JavaScript business logic.
F. Acceptance Criteria
Define clear conditions that determine whether the project is complete.
- Users can submit customer inquiries through the frontend.
- The backend successfully receives and processes lead submissions.
- Gemini extracts company name, budget, urgency, and summary.
- Invalid or incomplete AI responses are handled safely.
- The backend correctly classifies leads using budget thresholds.
- Enterprise leads receive ASSIGNED_ACCOUNT_EXEC routing status.
- Unqualified leads receive AUTO_NURTURE routing status.
- Leads with missing or invalid budget information receive MANUAL_REVIEW.
- All processed records are stored in MongoDB.
- Users can retrieve all leads through the dashboard.
- Enterprise sales users can retrieve only enterprise-qualified leads.
- The original customer message is preserved.
- API failures and database errors are handled gracefully.
- The application works correctly on the deployed website.
Spec sheet deliverable: A complete SPEC.md that another developer or AI coding assistant can follow without major clarification.

3. Phase 2: Set Up the Project
Create separate frontend and backend applications.

Frontend Setup:
npm create vite@latest client -- --template react

cd client

npm install

npm install react-router-dom axios

npm install tailwindcss @tailwindcss/vite


Backend Setup:
mkdir server

cd server

npm init -y

npm install express cors dotenv mongoose @google/genai zod

npm install --save-dev nodemon


Backend Environment Configuration:

Create a .env file inside the server directory.
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173


Never expose API keys in frontend code or commit secrets to GitHub.

Suggested Project Structure:
lead-qualification-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── SPEC.md
├── .gitignore
└── README.md


4. Phase 3: Build the Application
Follow the SPEC.md step by step.
1. Set up Express: Create the backend server and configure middleware.
2. Connect MongoDB: Establish the database connection using Mongoose.
3. Create the Lead Model: Define the schema for customer inquiries and extracted information.
4. Integrate Gemini: Configure Gemini 2.5 Flash to extract structured lead information.
5. Validate AI Output: Use Zod to validate the extracted JSON and handle invalid responses.
6. Implement Business Logic: Write JavaScript conditions for budget classification and routing.
7. Create API Endpoints: Implement lead submission, retrieval, enterprise filtering, and dashboard statistics.
8. Build the React Frontend: Develop the landing page, submission form, dashboard, enterprise page, and lead details page.
9. Connect Frontend and Backend: Use Axios to communicate with Express APIs.
10. Implement Dashboard: Display lead statistics, categorized records, and filtering options.
11. Handle Errors: Implement loading indicators, validation messages, and API failure handling.
12. Test the Application: Verify every feature against the acceptance criteria.
Students can use Codex or another AI coding assistant, but they should provide it with the SPEC.md file first. Build and test the application incrementally instead of generating everything in one step.
5. Phase 4: Test and Deploy
Testing Checklist:

Verify that:
- Customer inquiries can be submitted successfully.
- Gemini extracts all four required fields.
- Different message formats are processed correctly.
- Budget-based classification works correctly.
- Missing or ambiguous budgets are sent for manual review.
- Enterprise leads are routed correctly.
- Unqualified leads are routed to automatic nurturing.
- All lead records are saved in MongoDB.
- Dashboard statistics display correct values.
- Enterprise filtering returns only enterprise leads.
- Invalid requests are rejected.
- Gemini API failures are handled gracefully.
- Database connection failures are handled safely.
- API keys are not exposed in frontend code.
- The complete application works after deployment.
Suggested Deployment Platforms:
Component	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas
AI Integration	Google Gemini API
Source Code	GitHub

Final Deployment Requirements:
- Deploy the frontend and backend separately.
- Configure production environment variables.
- Connect the deployed backend to MongoDB Atlas.
- Configure frontend API URLs.
- Configure production CORS settings.
- Test all API endpoints on the deployed server.
- Verify that a customer can submit an inquiry and see the processed lead in the dashboard.

6. Final Project Deliverables
Deliverable	Expected Output
Specification	Complete SPEC.md
Frontend	Responsive React application
Backend	Node.js and Express REST API
AI Integration	Gemini-based extraction module
Database	MongoDB lead collection
Business Logic	Budget qualification and routing
Dashboard	Lead management interface
Testing	Verified API and application functionality
Deployment	Live website and backend
Documentation	README with installation and setup instructions

Final Project Goal

Build a fully functional AI-powered sales assistant that transforms unstructured customer inquiries into structured lead records, automatically qualifies potential customers, and routes them to the appropriate sales team using reliable backend business rules.
AI-powered extraction

Automated qualification and routing

Structured database management

Sales dashboard and lead monitoring