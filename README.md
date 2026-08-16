# Kapture Collections Voicebot
A voice-based AI assistant built for handling customer collection calls.
I built this project using Vapi for the voice assistant and Node.js/Express for handling the backend tool calls. The backend is deployed on Render and connected to the Vapi assistant through a webhook.
The assistant can verify a customer, discuss payment options, record a promise to pay, send a payment link, and record the final call disposition.
## What the assistant can do
The assistant follows a simple collection-call flow:
1. Greet the customer
2. Confirm the customer's identity
3. Verify the account ID and verification code
4. Discuss the overdue payment
5. Give the customer different payment options
6. Record a promise to pay when required
7. Send a payment link if requested
8. Record the outcome of the conversation
The assistant does not discuss account information before the customer is successfully verified.
## Tech Stack
 Vapi
 Node.js
 Express.js
 JavaScript
 Render
 Git
 GitHub
## Custom Tools
I created four custom tools in Vapi.
### verify_customer
This tool is used to verify the customer's identity before discussing account information.

for testing perpose use this:-
It takes:
account_id: "ACC-88392" AND 
verification_code: "1234"
