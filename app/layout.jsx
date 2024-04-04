export const metadata = {
  title: "HustGPT",
  description: "AI chatbot created by Minh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
