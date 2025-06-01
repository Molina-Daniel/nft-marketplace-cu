import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the address
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Generate a unique idempotency key using uuidv4
    const idempotencyKey = uuidv4();

    // Set up the options for the fetch request to Circle API
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      },
      body: JSON.stringify({
        idempotencyKey,
        address,
        chain: "ETH-SEPOLIA",
      }),
    };

    const complianceEnabled = process.env.ENABLE_COMPLIANCE_CHECK === "true";
    if (!complianceEnabled) {
      return Response.json({
        success: true,
        isApproved: true,
        data: {
          result: "APPROVED",
          message: "Compliance check is disabled",
        },
      });
    }

    // Make the API call to Circle
    const circleResponse = await fetch(
      "https://api.circle.com/v1/w3s/compliance/screening/addresses",
      options
    );

    if (!circleResponse.ok) {
      const errorData = await circleResponse.json();
      return NextResponse.json(
        { error: "Circle API error", details: errorData },
        { status: circleResponse.status }
      );
    }

    // Return the response from Circle
    const data = await circleResponse.json();
    const isApproved = data?.data?.result === "APPROVED";

    return Response.json({
      success: true,
      isApproved,
      data: data?.data,
    });
  } catch (error) {
    console.error("Compliance API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
