# Puesta en marcha de las e-labels alojadas

Lo que hace falta crear tú (yo no puedo abrir cuentas ni manejar claves):

## 1. Supabase (base de datos, gratis)
1. Crea un proyecto en supabase.com.
2. SQL Editor → pega y ejecuta `supabase/schema.sql`.
3. Settings → API: copia **Project URL** y la clave **service_role** (secreta, nunca en el navegador).

## 2. Stripe (cobros)
1. Crea cuenta en stripe.com y completa la verificación de negocio.
2. Developers → API keys: copia la **Secret key** (empieza por `sk_`). Empieza con la de modo test.
3. Developers → Webhooks → Add endpoint:
   - URL: `https://TU-DOMINIO/api/stripe/webhook`
   - Evento: `checkout.session.completed`
   - Copia el **Signing secret** (`whsec_…`).

## 3. Variables de entorno en Vercel (Settings → Environment Variables)
| Variable | Valor |
|---|---|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | clave service_role |
| `STRIPE_SECRET_KEY` | sk_test_… (luego sk_live_…) |
| `STRIPE_WEBHOOK_SECRET` | whsec_… |
| `NEXT_PUBLIC_SITE_URL` | `https://TU-DOMINIO` (sin barra final) |
| `ELABEL_PRICE_CENTS` | precio en céntimos, p. ej. `2900` |

## 4. Antes de cobrar de verdad
- Dominio propio (los QR impresos apuntan a él para siempre: no lo cambies).
- Alta fiscal para facturar (en España, autónomo / IVA). Consúltalo con una gestoría.
- Páginas legales: aviso legal, privacidad, condiciones de venta.
- Prueba un pago completo en modo test de Stripe (tarjeta 4242 4242 4242 4242).

## Local
Sin variables de entorno, en `pnpm dev` se usa un archivo `.data/elabels.json` y el
botón de pago salta Stripe. En producción esto está desactivado a propósito.
