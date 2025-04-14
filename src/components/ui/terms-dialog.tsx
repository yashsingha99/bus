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
import { ScrollArea } from "./scroll-area";
import { Button } from "@/components/ui/button";

export function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-gray-400 hover:text-primary p-0 h-auto font-normal"
        >
          Terms of Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription>
            Please read these terms carefully before using our services.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">1. Business Policy</h3>
              <p className="text-muted-foreground">
                Welcome to Bustify.in! By accessing or using our website, making
                a booking, or engaging with any of our services, you agree to
                comply with and be bound by the following Terms and Conditions.
                These Terms outline your rights and obligations when using our
                platform or services. Please read them carefully.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                2. Company Information
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Business Name:</strong> Bustify.in
                </p>
                <p>
                  <strong>Location:</strong> Near GLA University, Mathura,
                  Mathura, UTTAR PRADESH 281406
                </p>
                <p>
                  <strong>Primary Service:</strong> We offer bus transportation
                  services for students who need to travel to off-campus exam
                  locations.
                </p>
                <p>
                  <strong>Support:</strong> Contact us via phone at 7417582399
                  or email at bustify.in@gmail.com
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">3. Eligibility</h3>
              <p className="text-muted-foreground">
                To use our website and book our services, you must be at least
                18 years of age and capable of forming a legally binding
                contract. If you are under 18, you may use the service only with
                the involvement of a parent or legal guardian.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                4. Scope of Services
              </h3>
              <p className="text-muted-foreground">
                Bustify.in provides bus services for students who need to travel
                to external exam centers. Our service includes transportation
                between designated locations and exam centers. We reserve the
                right to modify, alter, or discontinue any part of our services
                at any time without prior notice.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">5. Bookings</h3>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-medium">5.1 Booking Process</h4>
                  <p>
                    Complete the booking process on our website with accurate
                    information. You&apos;ll receive a confirmation email or SMS.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">5.2 Booking Confirmation</h4>
                  <p>
                    Subject to availability. Alternative options or refunds will
                    be provided if we cannot fulfill your request.
                  </p>
                </div>
              </div>
            </section>

            {/* Add more sections as needed */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
