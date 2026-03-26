import { Generator } from "@/components/generator";

export default function GeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          .gitignore Oluşturucu
        </h1>
        <p className="text-muted-foreground text-sm">
          Teknolojilerini seç, .gitignore dosyanı oluştur
        </p>
      </div>
      <Generator />
    </div>
  );
}
