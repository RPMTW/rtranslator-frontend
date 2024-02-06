export default function TranslateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="h-[calc(100vh-64px)] w-screen flex flex-col">{children}</section>;
}
