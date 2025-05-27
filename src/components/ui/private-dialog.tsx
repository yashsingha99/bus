"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-gray-400 hover:text-primary p-0 h-auto font-normal"
        >
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Learn how we handle and protect your personal information.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Refund Policy</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Thank you for using our services at Bustify. We are committed
                  to providing a great experience for our customers. However, if
                  a cancellation occurs, our refund policy will apply.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    We update the ticket status every 5-10 hours to keep you
                    informed about any changes.
                  </li>
                  <li>
                    For waiting tickets, we charge a cancellation fee of 40% of
                    the ticket price.
                  </li>
                  <li>
                    For confirmed tickets, we charge a cancellation fee of 60%
                    of the ticket price.
                  </li>
                  <li>
                    For instant refunds, an additional 5% processing fee
                    applies.
                  </li>
                  <li>
                    Cancellations must be made at least 24 hours before
                    departure time.
                  </li>
                  <li>
                    Refunds are credited to the original payment method within
                    5-7 business days.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Cookie Policy</h3>
              <p className="text-muted-foreground">
                We employ the use of cookies. By accessing www.bustify.in, you
                agree to use cookies in accordance with Bustify&apos;s Privacy
                Policy. Our cookies help us provide you with a better website
                experience by enabling us to monitor which pages you find useful
                and which you do not.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Data Collection</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>We collect and process the following information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Personal identification information (Name, email address,
                    phone number, etc.)
                  </li>
                  <li>Booking history and preferences</li>
                  <li>
                    Payment information (processed securely through our payment
                    partners)
                  </li>
                  <li>
                    Device and browser information for service improvement
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Data Protection</h3>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your
                personal information. Your data is encrypted during transmission
                and stored securely. We do not share your personal information
                with third parties except as necessary to provide our services
                or as required by law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>For privacy-related inquiries, please contact us at:</p>
                <p>
                  <strong>Email:</strong> bustify.in@gmail.com
                </p>
                <p>
                  <strong>Phone:</strong> 7417582399
                </p>
                <p>
                  <strong>Address:</strong> Near GLA University, Mathura, UTTAR
                  PRADESH 281406
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
