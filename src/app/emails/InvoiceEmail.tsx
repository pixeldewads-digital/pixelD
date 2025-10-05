import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Order, OrderItem, Product, User } from "@prisma/client";
import { formatCurrency } from "@/lib/formatters";

type InvoiceEmailProps = {
  order: Order & { user: User; items: (OrderItem & { product: Product })[] };
};

const baseUrl = process.env.NEXTAUTH_URL;

export function InvoiceEmail({ order }: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your PixelDew Invoice</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Invoice #{order.id.slice(0, 8)}</Heading>
          <Text style={paragraph}>
            Hi {order.user.name ?? "there"}, thank you for your purchase. Here is a summary of your order:
          </Text>
          <Section>
            {order.items.map((item) => (
              <Text key={item.id} style={itemText}>
                {item.product.title} (x{item.quantity}) -{" "}
                {formatCurrency(item.priceCents / 100)}
              </Text>
            ))}
          </Section>
          <Hr style={hr} />
          <Text style={totalText}>
            <strong>Total Paid: {formatCurrency(order.totalCents / 100)}</strong>
          </Text>
          <Hr style={hr} />
          <Section style={btnContainer}>
            <Button style={button} href={`${baseUrl}/download`}>
              Go to My Downloads
            </Button>
          </Section>
          <Text style={footer}>
            PixelDew | High-quality digital assets for modern creators.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily: "sans-serif",
};
const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};
const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};
const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};
const itemText = {
  fontSize: "14px",
  lineHeight: "1.4",
  color: "#484848",
};
const totalText = {
  ...itemText,
  textAlign: "right" as const,
};
const btnContainer = {
  textAlign: "center" as const,
};
const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#ffffff",
  fontSize: "18px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};
const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
const footer = {
  color: "#999999",
  fontSize: "14px",
  lineHeight: "1.5",
};