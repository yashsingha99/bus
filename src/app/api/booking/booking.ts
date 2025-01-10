import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../model/user.model";

export async function POST(request: Request) { 
  
      await dbConnection();
      
      // const {}
      
      try {
         const {userData, center} = await request.json();
      } catch (error) {
        
      }
     
} 
 