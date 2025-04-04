

export default function BookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
     <main>
          {children}
     </main>

      <div> book </div>
    </div>
  );
}