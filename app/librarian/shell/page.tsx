
import { LibrarianHeader } from "@/components/librarian/LibrarianHeader";
import LibrarianSidebar from "@/components/librarian/LibrarianSidebar";

export default function LibrarianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <LibrarianSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <LibrarianHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
