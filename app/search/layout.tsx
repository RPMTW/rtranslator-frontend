export default function SearchLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col gap-4">
			<div className="inline-block text-center justify-center">
				{children}
			</div>
		</section>
	);
}
