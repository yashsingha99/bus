import { dbConnection } from "@/lib/db";
import { UserModel } from "../../../../model/user.model";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const { email, password } = await request.json();
    const user = await UserModel.findOne({ email });

    if (user) {

      // ********** User exists and needs verification/authentication ********** //


      if (user.isVerified && user.password === password) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Successfully logged in",
          }),
          { status: 200 } // OK
        );
      }


      // *********************** User is not verified yet ************************** //


      return new Response(
        JSON.stringify({
          success: false,
          message: "Please verify your email to proceed",
        }),
        { status: 403 } // Forbidden
      );
    }


    // ************************ User is not registered yet ********************** //


    return new Response(
      JSON.stringify({
        success: false,
        message: "User not found. Please register to continue",
      }),
      { status: 404 } // Not Found
    );


  } catch (error) {

    
    // ******************** An error occurred during the login process ************** //


    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error. Please try again later",
      }),
      { status: 500 } // Internal Server Error
    );
  }


}
