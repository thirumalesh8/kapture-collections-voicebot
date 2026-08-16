const express = require("express");

const app = express();

app.use(express.json());

function sendToolResult(res, callId, result) {
    return res.json({
        results: [
            {
                toolCallId: callId,
                result: JSON.stringify(result)
            }
        ]
    });
}

app.post("/webhook", (req, res) => {
    const { message } = req.body;

    const toolCall = message.toolCalls[0];

    const tool = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);
    const callId = toolCall.id;

    console.log("TOOL VALUE:", tool);
    console.log("Tool:", tool);
    console.log("Arguments:", args);

    if (tool === "verify_customer") {
        if (args.verification_code === "1234") {
            return sendToolResult(res, callId, {
                verified: true,
                message: "Identity verified successfully."
            });
        }

        return sendToolResult(res, callId, {
            verified: false,
            message: "Verification failed."
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