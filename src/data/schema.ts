// Datos estructurados (schema.org) del negocio: los leen Google, Bing y los buscadores con IA para
// saber qué es Femuix, dónde trabaja, quién está detrás y cuánto cuesta. Salen de los mismos datos
// que la página, así que no pueden contradecirla.
import { euros, fases, mensajeCentral, metodoCompleto, precios, site, tramos, url } from './site';

export function schemaNegocio(base: URL | undefined) {
  const abs = (path: string) => new URL(url(path), base).href;
  const inicio = abs('/');
  const negocio = `${inicio}#negocio`;
  const persona = `${inicio}#andrea`;
  const barcelona = {
    '@type': 'City',
    name: 'Barcelona',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Cataluña' },
  };
  const rango = (importes: number[]) => ({
    '@type': 'PriceSpecification',
    minPrice: Math.min(...importes),
    maxPrice: Math.max(...importes),
    priceCurrency: 'EUR',
    valueAddedTaxIncluded: true,
  });

  return [
    {
      '@type': 'WebSite',
      '@id': `${inicio}#web`,
      url: inicio,
      name: site.name,
      inLanguage: 'es-ES',
      publisher: { '@id': negocio },
    },
    {
      '@type': 'ProfessionalService',
      '@id': negocio,
      name: site.name,
      description: site.description,
      slogan: mensajeCentral,
      url: inicio,
      logo: abs('/femuix-logo.svg'),
      image: abs('/og-image.jpg'),
      email: site.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Barcelona',
        addressRegion: 'Cataluña',
        addressCountry: 'ES',
      },
      areaServed: barcelona,
      priceRange: `${euros(Math.min(...precios[0].importes))} – ${euros(Math.max(...metodoCompleto))}`,
      currenciesAccepted: 'EUR',
      knowsAbout: [
        'Interiorismo',
        'Reformas de vivienda',
        'Proyecto de reforma',
        'Distribución de viviendas',
        'Diseño de cocinas y baños',
        'Presupuestos de obra comparables',
      ],
      founder: { '@id': persona },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'El método Femuix',
        description: `Cuatro fases que se contratan y pagan por separado, según la superficie (${tramos.join(', ')}). IVA incluido.`,
        itemListElement: [
          ...fases.map((f, i) => ({
            '@type': 'Offer',
            name: `Fase ${f.n} · ${f.nombre}`,
            priceSpecification: rango(precios[i].importes),
            itemOffered: {
              '@type': 'Service',
              name: f.nombre,
              description: `${f.texto} Recibes: ${f.entregable}`,
              areaServed: barcelona,
              provider: { '@id': negocio },
            },
          })),
          {
            '@type': 'Offer',
            name: 'Método completo',
            priceSpecification: rango(metodoCompleto),
            itemOffered: {
              '@type': 'Service',
              name: 'El método Femuix completo',
              description:
                'Las cuatro fases, de 12 a 14 semanas: de la primera visita al proyecto listo para contratar la obra.',
              areaServed: barcelona,
              provider: { '@id': negocio },
            },
          },
        ],
      },
    },
    {
      '@type': 'Person',
      '@id': persona,
      name: 'Andrea',
      jobTitle: 'Interiorista',
      worksFor: { '@id': negocio },
      workLocation: barcelona,
    },
  ];
}
