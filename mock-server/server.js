const express = require("express");

const app = express();

app.use(express.json());

function sendToolResult(res, callId, result) {
    return res.status(200).json({
        results: [
            {
                toolCallId: callId,
                result: JSON.stringify(result)
            }
        ]
    });
}

app.post("/webhook", (req, res) => {
    console.log("========== VAPI REQUEST ==========");
    console.log(JSON.stringify(req.body, null, 2));

    const { message } = req.body;

   
    const toolCall = message.toolCallList?.[0];

    
    const oldToolCall = message.toolCalls?.[0];

    const call = toolCall || oldToolCall;

    if (!call) {
        console.log("No tool call found");
        return res.status(200).json({
            results: []
        });
    }

    let tool;
    let args;
    let callId;

    if (toolCall) {
        tool = toolCall.name;
        args = toolCall.arguments || {};
        callId = toolCall.id;
    } else {
        tool = call.function.name;
        args =
            typeof call.function.arguments === "string"
                ? JSON.parse(call.function.arguments)
                : call.function.arguments || {};
        callId = call.id;
    }

    console.log("TOOL:", tool);
    console.log("ARGUMENTS:", args);
    console.log("CALL ID:", callId);

    
    if (tool === "verify_customer") {
        if (
            args.account_id === "ACC-88392" &&
            args.verification_code === "1234"
        ) {
            return sendToolResult(res, callId, {
                verified: true,
                message: "Identity verified successfully."
            });
        }

        return sendToolResult(res, callId, {
            verified: false,
            message: "Verification failed. The account ID or verification code is incorrect."
        });
    }

    
    if (tool === "log_promise_to_pay") {
        return sendToolResult(res, callId, {
            success: true,
            message: "Promise to pay recorded successfully.",
            account_id: args.account_id,
            ptp_date: args.ptp_date,
            amount: args.amount
        });
    }

    
    if (tool === "send_payment_link") {
        return sendToolResult(res, callId, {
            success: true,
            message: `Payment link sent successfully via ${args.channel}.`
        });
    }

    
    if (tool === "mark_disposition") {
        return sendToolResult(res, callId, {
            success: true,
            disposition_logged: args.status,
            notes: args.notes || "No additional notes."
        });
    }

    return sendToolResult(res, callId, {
        success: false,
        message: "Unknown tool."
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});