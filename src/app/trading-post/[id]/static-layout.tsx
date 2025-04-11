// This is a server component that imports the generateStaticParams function
import { generateStaticParams } from './generateStaticParams';

// Re-export the generateStaticParams function
export { generateStaticParams };

// This is a simple pass-through layout that doesn't add any UI
export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
