"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

export default function PaymentDrawer({
  amount,
  setPaymentProof,
  isDisabled,
  handlePaymentByManual,
}: {
  amount: number;
  setPaymentProof?: (data: File) => void;
  isDisabled: boolean;
  handlePaymentByManual?: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadError("");
    
    try {
      // Set the file in the parent component state
      if (setPaymentProof) {
        setPaymentProof(files[0]);
      }
    } catch (error) {
      console.error("Error handling file:", error);
      setUploadError("Failed to process the file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const upiPay = (amount: number) => {
  const upiURL = `upi://pay?pa=9756144688@ptsbi&pn=YourStore&am=${amount}&cu=INR`;
  window.location.href = upiURL;
};

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <FeedbackButton
          className="w-full"
          variant="default"
          disabled={isDisabled}
        >
          Proceed to Payment Manual
        </FeedbackButton>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Payment Methods</DrawerTitle>
            <DrawerDescription>
              Make the payment first, then upload your screenshot here.
            </DrawerDescription>
            {/* <div className="mt-4">
              <Label>UPI ID</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  className="text-center lg:text-2xl text-lg lg:font-bold font-semibold"
                  readOnly
                  value={"9756144688@ptsbi"}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText("9756144688@ptsbi");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div> */}
            <FeedbackButton onClick={() => upiPay(amount)}>Proceed to Pay</FeedbackButton>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <FileUpload 
              onChange={handleFileUpload} 
              isUploading={isUploading}
              error={uploadError}
            />
          </div>
          <DrawerFooter>
            <Button 
              onClick={handlePaymentByManual}
              disabled={isUploading}
            >
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
