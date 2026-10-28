"""Optimiza la fuente Inter de la web: menos bytes con el mismo aspecto.

Uso, desde web/:   python3 scripts/fuentes/optimizar.py
Necesita:          pip install fonttools brotli

Parte de src/fonts/originales/inter-latin-wght-normal.woff2 (el subconjunto latino de Inter 5.3 de
fontsource) y escribe src/fonts/inter-latin.woff2. La web solo usa los pesos 400, 500 y 600, así que
se quita el resto del eje de peso (100 a 900), y de las funciones de la fuente se conservan las que
se usan: kerning, acentos, cifras tabulares y las que Inter aplica por defecto. De 48 a 31 KB; el
ancho de cualquier línea cambia menos de 0,05 px respecto al original.

Merriweather NO se toca, y es una decisión medida: su kerning (el 78 % de la fuente) lleva un índice
de variación por cada uno de sus 23.000 pares, porque cambia con el tamaño óptico. Reagruparlo en
clases sin perder esa variación ahorra solo un 7 %, y descartar la variación (que daba un 49 %)
cambia el ancho de un titular hasta 6 px, lo bastante para mover saltos de línea. Por eso se sirve
tal cual viene.
"""
import io
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RAIZ = Path(__file__).resolve().parents[2] / 'src' / 'fonts'
ORIGEN = RAIZ / 'originales'


def inter():
    font = TTFont(ORIGEN / 'inter-latin-wght-normal.woff2')
    # Pesos 400 a 600: el 300 solo lo usa la serifa y el 700 no se usa
    font = instancer.instantiateVariableFont(font, {'wght': (400, 600)})
    # Se guarda y se vuelve a abrir: el recorte de glifos no se lleva bien con la fuente recién instanciada
    memoria = io.BytesIO()
    font.save(memoria)
    font = TTFont(io.BytesIO(memoria.getvalue()), lazy=False)
    opciones = subset.Options()
    opciones.layout_features = ['kern', 'mark', 'mkmk', 'calt', 'ccmp', 'locl', 'tnum']
    opciones.glyph_names = False
    opciones.notdef_outline = True
    opciones.hinting = False
    opciones.name_IDs = [1, 2, 3, 4, 6]
    sub = subset.Subsetter(opciones)
    sub.populate(unicodes=font.getBestCmap().keys())
    sub.subset(font)
    font.flavor = 'woff2'
    destino = RAIZ / 'inter-latin.woff2'
    font.save(destino)
    antes = (ORIGEN / 'inter-latin-wght-normal.woff2').stat().st_size
    print(f'inter-latin.woff2: {antes:,} → {destino.stat().st_size:,} bytes')


if __name__ == '__main__':
    inter()
