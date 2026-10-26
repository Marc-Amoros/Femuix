// El scroll suave (scripts/motion.ts) deja su instancia en window para que otros scripts puedan
// pararlo (menú abierto) o llevarlo a un punto (índice del método).
interface Window {
  lenis?: import('lenis').default;
  // Ventana emergente de Tally (https://tally.so/widgets/embed.js), para el formulario
  Tally?: {
    openPopup: (formId: string, options?: Record<string, unknown>) => void;
  };
}
