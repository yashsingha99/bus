import axios from "axios";

    
export async function createOrderId(amount: number, currency: string, tripId : string) {
    try {
        const response = await axios.post(`/api/createOrder`, {
            amount: amount * 100, // Convert to paise
            currency: currency,
            tripId
        });

        // console.log("Order Response:", response.data);
        return response.data.orderId;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create order");
    }
}