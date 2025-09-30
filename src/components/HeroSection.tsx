
import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="container mx-auto py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          Descubra o que está bombando antes de todo mundo.
        </h1>
        <p className="text-lg text-trend-gray-dark mb-8">
          Identifique tendências emergentes e obtenha insights acionáveis para o seu conteúdo e negócio.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-trend-gray-dark" />
          <input
            type="text"
            placeholder="Digite um termo, categoria ou ideia..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-border focus:border-trend-blue focus:ring-1 focus:ring-trend-blue focus:outline-none"
          />
          <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-trend-blue hover:bg-trend-blue/90 rounded-full px-6 py-2 text-white">
            Buscar
          </Button>
        </div>
      </div>
    </section>
  );
};

const Button = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <button className={className}>
      {children}
    </button>
  );
};

export default HeroSection;
