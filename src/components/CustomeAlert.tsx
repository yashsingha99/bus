"use client"

import React, { useEffect } from 'react'
import { Alert } from "@heroui/alert";

interface CustomeAlertProps {
  alertDescription: string;
  alertIsVisible: boolean;
  alertTitle: string;
  setAlertIsVisible: (value: boolean) => void;
  type?: 'success' | 'warning' | 'default' | 'primary' | 'secondary' | 'danger';
}

function CustomeAlert({ 
  alertDescription, 
  alertIsVisible, 
  alertTitle, 
  setAlertIsVisible,
  type = 'success' 
}: CustomeAlertProps) {
  useEffect(() => {
    if (alertIsVisible) {
      const timer = setTimeout(() => {
        setAlertIsVisible(false);
      }, 5000); // Auto hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [alertIsVisible, setAlertIsVisible]);

  if (!alertIsVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 z-50 w-96">
      <Alert
        color={type}
        description={alertDescription}
        isVisible={alertIsVisible}
        title={alertTitle}
        variant="faded"
        onClose={() => setAlertIsVisible(false)}
      />
     </div>
  )
}

export default CustomeAlert