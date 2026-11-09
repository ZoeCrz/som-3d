"""Build the portable HTML using browser-native emoji (no bundled font artwork)."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'desarrollo'
html = (SRC / 'interfaz.html').read_text(encoding='utf-8')
html = html.replace('/*__EMOJI_ASSETS__*/', 'const EMOJI_ASSETS = {};')
html = html.replace('/*__SOM__*/', (SRC / 'som.js').read_text(encoding='utf-8'))
html = html.replace('/*__APP__*/', (SRC / 'app.js').read_text(encoding='utf-8'))
(ROOT / 'Mapa_Autoorganizado_IA.html').write_text(html, encoding='utf-8')
print('Generado Mapa_Autoorganizado_IA.html')
