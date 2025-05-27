import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { TripModel } from "@/model/trip.model";
const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string;
const key_secret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET as string;

if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are missing");
}

const razorpay = new Razorpay({
    key_id,
    key_secret
})

export type OrderBody = {
    tripId : string
    amount: number;
    currency: string;
}

export async function POST(request: NextRequest) {
    try {

        const { amount, currency, tripId }: OrderBody = await request.json();
        if (!amount) {
            return NextResponse.json({ message: `Amount is required` }, { status: 400 })
        }

        if (!tripId) {
            return NextResponse.json({ message: `TripId is required` }, { status: 400 })
        }
        
        const trip = await TripModel.findById(tripId);

        if(!trip){
            return NextResponse.json({ message: `Trip Doesn't Exist` }, { status: 400 })
        }
        
        if(amount !== trip.Trips[0].price * 100){
            return NextResponse.json({ message: `MEMORY DECRYPTED` }, { status: 403 })
        }
        const options = {
            amount,
            currency: currency || "INR",
            receipt: `receipt#${Date.now()}`,
        }

        const order = await razorpay.orders.create(options);
        console.log("Order Created Successfully");

        return NextResponse.json({ orderId: order.id }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: "Server Error", error }, { status: 500 })
    }
}