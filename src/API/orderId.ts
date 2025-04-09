import axios from "axios";
const URL = process.env.NEXT_PUBLIC_API_URL;

export async function createOrderId(amount: number, currency: string) {
    try {
        const response = await axios.post(`${URL}/api/createOrder`, {
            amount: amount * 100, // Convert to paise
            currency: "INR",
        });

        console.log("Order Response:", response.data);
        return response.data.orderId;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create order");
    }
}