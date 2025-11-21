import { PillIcon } from '@/components/icons';

export function Header() {
  return (
    <header className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <PillIcon className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Pill Pal
        </h1>
      </div>
    </header>
  );
}
