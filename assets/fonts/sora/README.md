# sora

Sora 2.000 — https://github.com/google/fonts/tree/69109d1f48319d1d474a8d2f70018efc2346a3a7/ofl/sora
O repositório oficial fornece `Sora[wght].ttf`, não WOFF2. A partir desse arquivo fixado, as instâncias 600 e 700 foram geradas em WOFF2 com fontTools 4.59.2 e Brotli. A licença vem do mesmo commit.

Fonte variável: `Sora[wght].ttf` ([google/fonts, commit fixo](https://github.com/google/fonts/blob/69109d1f48319d1d474a8d2f70018efc2346a3a7/ofl/sora/Sora%5Bwght%5D.ttf)); SHA-256 `84ff7096ae3ec6c8be47d906d1a0ba4de7f2ce78c615275c77301964a316e16c`. O único eixo, `wght` (100–800), foi fixado em 600 e 700, respectivamente.

Com o TTF em `node_modules/font-download/Sora.ttf` e fontTools 4.59.2 com Brotli em `node_modules/font-tools`, o comando executado foi:

```sh
PYTHONPATH=node_modules/font-tools python3 - <<'PYFONT'
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
for weight, label in [(600,'SemiBold'),(700,'Bold')]:
    font=TTFont('node_modules/font-download/Sora.ttf', recalcTimestamp=False)
    font=instantiateVariableFont(font, {'wght': weight}, inplace=True)
    font.flavor='woff2'
    font.save(f'assets/fonts/sora/Sora-{label}.woff2')
PYFONT
```

Comparação com a origem instanciada em memória nos mesmos pesos: as duas mantêm 513 glifos e cmap idêntico de 378 codepoints. `unitsPerEm` é 1000; hhea e OS/2 tipográfico têm ascendente 970, descendente -290 e lineGap 0 (OS/2 Windows: 1220/320). Os avanços horizontais dos 88 caracteres A–Z, a–z, 0–9 e letras acentuadas do português coincidem, sem ausências ou diferenças.

SHA-256 dos arquivos de fonte e da licença:

```text
ba0b9729c9428ba79a0459ab8ec575791b51509dbec213e383d0316d37fec299  OFL.txt
25d586d75edbc326eda83e67179559a0adb06c7da5f033a6d9a4f9c2b32b4971  Sora-Bold.woff2
5d8300ee6ae3b68c8fd63ee4d082385dc1826b7dab3cd2d681422e12cb522783  Sora-SemiBold.woff2
```
