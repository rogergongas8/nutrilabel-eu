# NutriLabel EU — Estación de Etiquetado Nutricional (UE 1169/2011) y E-Label de Vinos (UE 2021/2117)

Aplicación web *Tool-First* de cálculo nutricional ponderado y generación de etiquetas vectoriales listas para imprenta conforme al **Artículo 31.4 del Reglamento (UE) Nº 1169/2011** y **Reglamento (UE) 2021/2117** (etiquetado electrónico de vinos y bebidas alcohólicas).

## Características
- **Modo 1: Alimentos Envasados (UE 1169/2011 & FDA):** Base de datos contrastada BEDCA/USDA, cálculo de merma térmica por horneado/cocción, detección y tipografía automática de los 14 alérgenos obligatorios (Anexo II) y expediente técnico APPCC imprimible para inspecciones de Sanidad.
- **Modo 2: Vinos y Bebidas Alcohólicas (UE 2021/2117):** Cálculo energético oficial por 100 ml a partir del grado alcohólico (`% vol`), azúcares residuales, acidez y polialcoholes; generación de sello físico `E` y código QR vectorial hacia ficha sin cookies.

## Ejecución y Despliegue en Vercel
```bash
pnpm install
pnpm dev    # Corre en http://localhost:3000
pnpm build  # Compilación de producción
```
