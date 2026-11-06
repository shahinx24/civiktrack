import { MOCK_ISSUES } from "@/mock/issues";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IssueDetailView } from "@/components/issues/issue-detail-view";

export function generateStaticParams() {
  return MOCK_ISSUES.map((issue) => ({
    id: issue.id,
  }));
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <IssueDetailView id={resolvedParams.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
