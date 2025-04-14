import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SubscriptionEmailProps {
  username: string;
}

const baseUrl = "https://bustify.in";

const main = {
  backgroundColor: "#f9f9f9",
  backgroundImage: `url('/public/bus.jpg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  maxWidth: "500px",
  margin: "0 auto",
  padding: "50px 40px",
  textAlign: "center" as const,
};

const logo = {
  marginBottom: "20px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#222",
  marginBottom: "8px",
};

const subheading = {
  fontSize: "16px",
  color: "#555",
  marginBottom: "24px",
};

const paragraph = {
  fontSize: "14px",
  color: "#444",
  lineHeight: "22px",
  marginBottom: "32px",
};

const buttonContainer = {
  marginBottom: "30px",
};

const button = {
  backgroundColor: "#0a85ea",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
};

const footerNote = {
  fontSize: "12px",
  color: "#999",
  lineHeight: "18px",
};

const footerLink = {
  color: "#0a85ea",
  textDecoration: "underline",
  marginLeft: "4px",
};

const footer = {
  fontSize: "11px",
  color: "#888",
  marginTop: "20px",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
  fontWeight: "bold" as const,
};

const subscriptionEmail = ({ username }: SubscriptionEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`/image/bus.jpg`}
          width="120"
          height="40"
          alt="Bustify"
          style={logo}
        />
        <Heading style={heading}>Welcome to Bustify 🎉</Heading>
        <Text style={subheading}>Hey {username}, thanks for subscribing!</Text>
        <Text style={paragraph}>
          You’re now connected to Bustify. We’re excited to have you on board.
          Get ready to explore the latest tools, updates, and exclusive features
          tailored just for you.
        </Text>

        <Section style={buttonContainer}>
          <Link href="https://bustify.in/" style={button}>
            Go to Dashboard
          </Link>
        </Section>

        <Text style={footerNote}>
          If you didn’t sign up for this, feel free to ignore this email or
          <Link href="mailto:contact@bustify.in" style={footerLink}>
            {" "}
            contact support
          </Link>
          .
        </Text>
      </Container>

      <Text style={footer}>Powered by Bustify</Text>
    </Body>
  </Html>
);

export default subscriptionEmail;
