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
    try {
        const { message } = req.body;

        const toolCalls = message.toolCallList || message.toolCalls;

        if (!toolCalls || toolCalls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No tool call received."
            });
        }

        const toolCall = toolCalls[0];

        const tool = toolCall.function.name;

        let args = toolCall.function.arguments;

       
        if (typeof args === "string") {
            args = JSON.parse(args);
        }

        const callId = toolCall.id;

        console.log("TOOL:", tool);
        console.log("ARGUMENTS:", args);

    

        if (tool === "verify_customer") {
            const verified =
                args.account_id === "ACC-88392" &&
                args.verification_code === "1234";

            if (verified) {
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
                message: "Payment link sent successfully.",
                account_id: args.account_id
            });
        }

        

        if (tool === "mark_disposition") {
            return sendToolResult(res, callId, {
                success: true,
                disposition_logged: args.disposition,
                notes: args.notes || "No additional notes."
            });
        }

        
        return sendToolResult(res, callId, {
            success: false,
            message: "Unknown tool."
        });

    } catch (error) {
        console.error("Webhook error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});