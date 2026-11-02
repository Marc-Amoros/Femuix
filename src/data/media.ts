// Material de MUESTRA para ver cómo queda la web con fotos y vídeo.
// Fotos de Unsplash y vídeo de Pexels, ambos con licencia de uso gratuita.
// Antes de publicar: sustituir por fotos y vídeo reales de Femuix y alojarlos en la propia web
// (carpeta /public), para no depender de servidores externos.
// Con `usarMuestras = false` la web vuelve a mostrar los huecos reservados.
export const usarMuestras = true;

export interface Foto {
  id: string; // identificador de la foto en images.unsplash.com
  alt: string;
  fuente: string; // página original de la foto
}

export const fotos: Record<'portada' | 'antes' | 'despues' | 'sobreMi', Foto> = {
  portada: {
    id: '1779960723465-61f8d0f5ac2b',
    alt: 'Comedor reformado con un arco, mesa ovalada y sillas verdes junto a una ventana luminosa',
    fuente: 'https://unsplash.com/photos/649Nu8EOVyM',
  },
  antes: {
    id: '1634586648651-f1fb9ec10d90',
    alt: 'Estancia en plena obra, con puntales metálicos y escombros en el suelo',
    fuente: 'https://unsplash.com/photos/biRt6RXejuk',
  },
  despues: {
    id: '1786564026100-7ad7ae7654b2',
    alt: 'Salón reformado con techos altos, sofá claro, aparador de madera y mampara de vidrio',
    fuente: 'https://unsplash.com/photos/p_xTs-dajHk',
  },
  sobreMi: {
    id: '1781888693625-4955204a81a0',
    alt: 'Imagen de muestra: diseñadora sonriente con planos enrollados en un interior',
    fuente: 'https://unsplash.com/photos/SjEGSy0G-9A',
  },
};

export const video = {
  src: 'https://videos.pexels.com/video-files/5384977/5384977-hd_1366_720_30fps.mp4',
  poster: 'https://images.pexels.com/videos/5384977/pexels-photo-5384977.jpeg?auto=compress&w=1600',
  descripcion: 'Dos mujeres revisan bocetos de interiorismo sobre una mesa',
  // Alternativa en texto del vídeo (WCAG 1.2.1). Con el vídeo real: subtítulos y transcripción completa.
  transcripcion:
    'Dos mujeres revisan sobre una mesa varios bocetos a lápiz de interiores: una sala de estar, un baño y un dormitorio. Una sostiene un lápiz y la otra señala con el dedo uno de los dibujos.',
  fuente: 'https://www.pexels.com/video/women-looking-at-interior-designs-laid-over-the-table-5384977/',
};

// URL de la foto al ancho pedido (Unsplash la recorta y comprime al vuelo)
export const fotoUrl = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const fotoSrcset = (id: string, anchos = [480, 800, 1200, 1600]) =>
  anchos.map((w) => `${fotoUrl(id, w)} ${w}w`).join(', ');
