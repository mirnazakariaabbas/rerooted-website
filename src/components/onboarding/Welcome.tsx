import { Button } from '@/components/ui/button';

interface WelcomeProps {
  onNext: () => void;
}

const Welcome = ({ onNext }: WelcomeProps) => (
  <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 text-center">
    <div className="mb-8 text-6xl">🌱</div>
    <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-6 text-foreground">
      Relocation is not a moment.
      <br />
      <span className="text-primary">It's a journey.</span>
    </h1>
    <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
      Re-Rooted® is your personal companion through every stage, from preparing to leave,
      to finding your ground, to feeling truly at home.
    </p>
    <Button onClick={onNext} size="lg" className="rounded-full px-10 py-6 text-base font-medium">
      Let's get started
    </Button>
    <p className="mt-6 text-sm text-muted-foreground italic">
      The human side of relocation
    </p>
  </div>
);

export default Welcome;
