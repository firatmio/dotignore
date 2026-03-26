import { Generator } from "@/components/generator";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Hero */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Akıllı <span className="text-primary">.gitignore</span> Oluşturucu
          </h1>
          <p className="text-muted-foreground text-lg">
            Teknolojilerini seç, .gitignore dosyanı oluştur. Çakışma tespiti ve AI önerileri dahil.
          </p>
        </div>

        {/* Generator */}
        <Generator />
      </div>
    </div>
  );
}
