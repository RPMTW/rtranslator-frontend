export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="lg:w-[65vw]">{children}</section>;
}
