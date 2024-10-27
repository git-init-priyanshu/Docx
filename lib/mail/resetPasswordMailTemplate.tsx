import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetMailTemplatePropType {
  userFirstname?: string;
  resetPasswordLink?: string;
}

export const PasswordResetMailTemplate = ({
  resetPasswordLink,
}: PasswordResetMailTemplatePropType) => (
  <Html>
    <Head />
    <Preview>Reset your Password.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://utfs.io/f/LdDzZPI8fQBxKbb3HNCkfF8wBL2EAoScHb6gpCdiGTzjU3rt"
            width="80"
            height="80"
            alt="DocX"
          />
        </Section>

        <Heading style={h1}>Reset your Password.</Heading>
        <Text style={text}>Hi,</Text>
        <Text style={text}>
          Someone recently requested a password change for your DocX account. If
          this was you, you can set a new password here:
        </Text>
        <Button style={button} href={resetPasswordLink}>
          Reset password
        </Button>
        <Text style={text}>
          If you didn&apos;t request this email, there&apos;s nothing to worry
          about, you can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
);

PasswordResetMailTemplate.PreviewProps = {
  validationCode: "DJZ-TLX",
} as PasswordResetMailTemplatePropType;

export default PasswordResetMailTemplate;

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const logoContainer = {
  display: "flex",
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
