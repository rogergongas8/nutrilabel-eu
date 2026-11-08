export interface SeoFoodTemplate {
  slug: string;
  navLabelEn: string;
  navLabelEs: string;
  workMode: "food" | "wine";
  title: string;
  description: string;
  h1En: string;
  h1Es: string;
  subtitleEn: string;
  subtitleEs: string;
  productNameEn: string;
  productNameEs: string;
  evaporationPercent: number;
  servingsCount: number;
  recipeItems: Array<{ ingredientId: string; amountGrams: number }>;
  faqQuestionEn: string;
  faqAnswerEn: string;
}

export const SEO_FOOD_TEMPLATES: SeoFoodTemplate[] = [
  {
    slug: "bakery-cookies",
    navLabelEn: "Bakery & Cookies",
    navLabelEs: "Galletas y Repostería",
    workMode: "food",
    title: "Free Nutrition Label Generator for Bakery & Cookies (FDA & EU/UK)",
    description:
      "Create official FDA Nutrition Facts and EU/UK per-100g nutrition labels for cookies, biscuits, and bakery products. Includes baking moisture loss (%) and bold wheat/egg/milk allergens.",
    h1En: "Free Nutrition Label Generator for Bakery & Cookies",
    h1Es: "Generador de Etiqueta Nutricional para Galletas y Pastelería",
    subtitleEn:
      "Pre-loaded with an artisanal oat & honey cookie recipe and 12% oven moisture loss. Customize ingredients and download your 300 DPI PNG or vector SVG.",
    subtitleEs:
      "Precargado con receta de galletas artesanas y 12% de merma de horneado. Ajusta tus gramos y descarga en PNG o SVG vectorial.",
    productNameEn: "Artisanal Oat & Honey Cookies",
    productNameEs: "Galletas Artesanas de Avena y Miel",
    evaporationPercent: 12,
    servingsCount: 12,
    recipeItems: [
      { ingredientId: "copos-avena", amountGrams: 200 },
      { ingredientId: "harina-trigo-comun", amountGrams: 100 },
      { ingredientId: "mantequilla-sin-sal", amountGrams: 80 },
      { ingredientId: "miel-abeja", amountGrams: 70 },
      { ingredientId: "huevo-entero-fresco", amountGrams: 50 },
      { ingredientId: "nueces-peladas", amountGrams: 40 },
    ],
    faqQuestionEn: "How do I account for moisture loss when baking cookies?",
    faqAnswerEn:
      "During baking, cookies typically lose between 10% and 14% of their raw dough weight due to water evaporation. Use the cooking water loss slider to concentrate nutrients per 100g of finished baked product.",
  },
  {
    slug: "sourdough-bread",
    navLabelEn: "Sourdough & Bread",
    navLabelEs: "Pan Artesano y Masa Madre",
    workMode: "food",
    title: "Free Nutrition Label Maker for Sourdough & Artisan Bread (EU/UK & FDA)",
    description:
      "Calculate official per-100g and per-slice nutrition labels for sourdough bread, baguettes, and bakery loaves with automatic baking evaporation adjustment.",
    h1En: "Nutrition Label Maker for Sourdough & Artisan Bread",
    h1Es: "Etiqueta Nutricional para Pan de Masa Madre y Panadería",
    subtitleEn:
      "Pre-configured for artisan bread loaves with 15% baking evaporation loss and gluten allergen formatting.",
    subtitleEs:
      "Configurado para hogaza de pan artesano con 15% de pérdida de agua en horno y declaración de gluten.",
    productNameEn: "Artisan Country Sourdough Loaf",
    productNameEs: "Hogaza de Pan de Masa Madre",
    evaporationPercent: 15,
    servingsCount: 14,
    recipeItems: [
      { ingredientId: "harina-trigo-comun", amountGrams: 500 },
      { ingredientId: "agua-potable", amountGrams: 350 },
      { ingredientId: "harina-centeno-integral", amountGrams: 60 },
      { ingredientId: "aceite-oliva-virgen-extra", amountGrams: 15 },
      { ingredientId: "sal-comun", amountGrams: 10 },
    ],
    faqQuestionEn: "Why does bread have higher calories per 100g after baking?",
    faqAnswerEn:
      "Raw bread dough contains around 40% water. In the oven, 12% to 18% of the total weight evaporates as steam, concentrating carbohydrates and protein per 100g of baked loaf.",
  },
  {
    slug: "homemade-jam",
    navLabelEn: "Homemade Jam & Preserves",
    navLabelEs: "Mermeladas y Conservas",
    workMode: "food",
    title: "Free Nutrition Label Generator for Homemade Jam, Jelly & Preserves",
    description:
      "Generate compliant FDA & EU/UK nutrition labels for homemade strawberry jam, marmalade, and fruit preserves with boiling reduction adjustment.",
    h1En: "Nutrition Label Generator for Homemade Jam & Preserves",
    h1Es: "Etiqueta Nutricional para Mermeladas y Conservas Artesanas",
    subtitleEn:
      "Includes thermal reduction calculation (22% water evaporation during boiling) for accurate sugar concentration per 100g.",
    subtitleEs:
      "Incluye cálculo de reducción por cocción (22% de evaporación) para declarar con exactitud los azúcares por 100 g.",
    productNameEn: "Extra Strawberry Artisan Jam",
    productNameEs: "Mermelada Extra de Fresa Artesana",
    evaporationPercent: 22,
    servingsCount: 15,
    recipeItems: [
      { ingredientId: "fresas-frescas", amountGrams: 650 },
      { ingredientId: "azucar-moreno", amountGrams: 280 },
      { ingredientId: "agua-potable", amountGrams: 40 },
    ],
    faqQuestionEn: "How is sugar per 100g calculated for homemade jam?",
    faqAnswerEn:
      "NutriLabel sums the natural fruit sugars and added sugar, then divides by the final reduced weight after boiling evaporation (typically 20-25% moisture loss).",
  },
  {
    slug: "raw-honey",
    navLabelEn: "Raw Honey & Beekeeping",
    navLabelEs: "Miel Cruda y Apicultura",
    workMode: "food",
    title: "Free FDA & EU/UK Nutrition Facts Label Generator for Raw Honey",
    description:
      "Download print-ready nutrition labels for raw honey, infused honey, and beekeeping jars in vector SVG and 300 DPI PNG.",
    h1En: "Free Nutrition Label Generator for Raw & Artisanal Honey",
    h1Es: "Generador de Etiquetas Nutricionales para Miel Artesana",
    subtitleEn:
      "Ready-to-print per 100g and per-tablespoon (21g) nutrition declaration for beekeepers and honey packers.",
    subtitleEs:
      "Declaración nutricional por 100 g y por cucharada lista para apicultores y envasadores de miel.",
    productNameEn: "100% Pure Raw Wildflower Honey",
    productNameEs: "Miel Cruda Milflores 100% Pura",
    evaporationPercent: 0,
    servingsCount: 24,
    recipeItems: [{ ingredientId: "miel-abeja", amountGrams: 500 }],
    faqQuestionEn: "Does pure single-ingredient honey require a nutrition label?",
    faqAnswerEn:
      "While unprocessed single-ingredient products have exemptions in some jurisdictions, Amazon FBA, major supermarkets, and infused honey products require a standard per-100g or FDA Nutrition Facts panel.",
  },
  {
    slug: "hot-sauce-salsa",
    navLabelEn: "Hot Sauce & Salsa",
    navLabelEs: "Salsas y Tomate Frito",
    workMode: "food",
    title: "Free Nutrition Facts Label Maker for Hot Sauce, Salsa & Condiments",
    description:
      "Create FDA and EU/UK nutrition labels for craft hot sauce, tomato pasta sauce, pesto, and condiments. Free 300 DPI PNG and vector SVG export.",
    h1En: "Nutrition Label Maker for Hot Sauce, Salsa & Condiments",
    h1Es: "Etiqueta Nutricional para Salsas Artesanas y Condimentos",
    subtitleEn:
      "Calculate per-100g and per-serving nutrition values for simmered sauces, dressings, and marinades.",
    subtitleEs:
      "Calcula los valores por 100 g y por ración para salsas cocinadas, aliños y adobos.",
    productNameEn: "Artisan Roasted Tomato & Olive Oil Sauce",
    productNameEs: "Salsa Napolitana Artesana con AOVE",
    evaporationPercent: 15,
    servingsCount: 6,
    recipeItems: [
      { ingredientId: "tomate-triturado", amountGrams: 700 },
      { ingredientId: "cebolla-fresca", amountGrams: 120 },
      { ingredientId: "aceite-oliva-virgen-extra", amountGrams: 45 },
      { ingredientId: "azucar-blanco", amountGrams: 10 },
      { ingredientId: "sal-comun", amountGrams: 8 },
    ],
    faqQuestionEn: "How do I label small 5g or 15g servings for sauces?",
    faqAnswerEn:
      "Set the total servings per jar to match your standard portion size (e.g., 15g per tablespoon or 60g for pasta sauce). NutriLabel automatically applies official '< 0.5g' rounding rules.",
  },
  {
    slug: "meal-prep-catering",
    navLabelEn: "Meal Prep & Catering",
    navLabelEs: "Tuppers y Comida Preparada",
    workMode: "food",
    title: "Free Nutrition Label Generator for Meal Prep, Catering & Ready Meals",
    description:
      "Generate macro-accurate nutrition labels (calories, protein, carbs, fat, allergens) for fitness meal prep bowls, catering trays, and takeaway food.",
    h1En: "Nutrition Label Generator for Meal Prep & Ready Meals",
    h1Es: "Etiquetas Nutricionales para Tuppers, Catering y Platos Preparados",
    subtitleEn:
      "Ideal for fitness meal prep businesses, commercial kitchens, and takeaway containers.",
    subtitleEs:
      "Diseñado para empresas de platos preparados, cocinas centrales, hostelería y comida para llevar.",
    productNameEn: "High-Protein Chicken & Chickpea Bowl",
    productNameEs: "Tupper Pollo Asado con Garbanzos",
    evaporationPercent: 8,
    servingsCount: 1,
    recipeItems: [
      { ingredientId: "pechuga-pollo-cruda", amountGrams: 180 },
      { ingredientId: "garbanzos-cocidos-conserva", amountGrams: 150 },
      { ingredientId: "tomate-triturado", amountGrams: 80 },
      { ingredientId: "aceite-oliva-virgen-extra", amountGrams: 15 },
      { ingredientId: "sal-comun", amountGrams: 2 },
    ],
    faqQuestionEn: "Can I show macros for a whole single-serving meal prep container?",
    faqAnswerEn:
      "Yes! Set 'Servings per package' to 1. The label will display both the mandatory per-100g column and the exact calories and protein for the entire container.",
  },
  {
    slug: "artisan-chocolate",
    navLabelEn: "Artisan Chocolate",
    navLabelEs: "Chocolate y Bombones",
    workMode: "food",
    title: "Free Nutrition Label Maker for Artisan Chocolate & Confectionery",
    description:
      "Create EU/UK 1169/2011 and US FDA nutrition labels for bean-to-bar chocolate bars, pralines, truffles, and confectionery.",
    h1En: "Nutrition Label Maker for Artisan Chocolate & Confectionery",
    h1Es: "Etiqueta Nutricional para Chocolate Artesano y Bombonería",
    subtitleEn:
      "Pre-loaded with cocoa, cocoa butter, cane sugar, and roasted almonds with automatic tree-nut allergen highlighting.",
    subtitleEs:
      "Precargado con cacao, manteca, azúcar y almendras con resaltado automático de frutos de cáscara.",
    productNameEn: "70% Dark Chocolate Bar with Roasted Almonds",
    productNameEs: "Tableta de Chocolate Negro 70% con Almendras",
    evaporationPercent: 0,
    servingsCount: 4,
    recipeItems: [
      { ingredientId: "cacao-puro-polvo", amountGrams: 50 },
      { ingredientId: "azucar-moreno", amountGrams: 30 },
      { ingredientId: "almendra-cruda", amountGrams: 25 },
      { ingredientId: "mantequilla-sin-sal", amountGrams: 20 },
    ],
    faqQuestionEn: "How are allergens like milk, soy lecithin, and nuts formatted on chocolate labels?",
    faqAnswerEn:
      "NutriLabel automatically formats all ingredients in descending order by weight and highlights any of the 14 mandatory EU allergens (such as almonds, hazelnuts, milk, or soy) in bold.",
  },
  {
    slug: "granola-oats",
    navLabelEn: "Granola & Cereal",
    navLabelEs: "Granola y Cereales",
    workMode: "food",
    title: "Free Nutrition Label Generator for Homemade Granola, Muesli & Oats",
    description:
      "Calculate nutrition facts and QUID ingredient lists for baked granola, muesli, and breakfast cereals. Free PNG & SVG download.",
    h1En: "Nutrition Label Generator for Granola, Muesli & Cereals",
    h1Es: "Etiqueta Nutricional para Granola Artesana y Muesli",
    subtitleEn:
      "Includes oats, nuts, honey, and olive oil with 8% roasting moisture loss.",
    subtitleEs:
      "Incluye avena, frutos secos y miel con ajuste del 8% por tostado en horno.",
    productNameEn: "Crunchy Honey & Walnut Granola",
    productNameEs: "Granola Crujiente de Miel y Nueces",
    evaporationPercent: 8,
    servingsCount: 10,
    recipeItems: [
      { ingredientId: "copos-avena", amountGrams: 300 },
      { ingredientId: "nueces-peladas", amountGrams: 70 },
      { ingredientId: "almendra-cruda", amountGrams: 50 },
      { ingredientId: "miel-abeja", amountGrams: 60 },
      { ingredientId: "aceite-oliva-virgen-extra", amountGrams: 25 },
    ],
    faqQuestionEn: "Does granola need gluten and tree nut allergen warnings?",
    faqAnswerEn:
      "Yes. Oats (unless certified gluten-free) and tree nuts (walnuts, almonds) are mandatory allergens that NutriLabel automatically highlights in bold within your ingredient list.",
  },
  {
    slug: "olive-oil",
    navLabelEn: "Extra Virgin Olive Oil",
    navLabelEs: "Aceite de Oliva (AOVE)",
    workMode: "food",
    title: "Free EU & FDA Nutrition Label Maker for Extra Virgin Olive Oil (EVOO)",
    description:
      "Generate official nutrition declarations for Extra Virgin Olive Oil (EVOO) bottles and tins per 100g / 100ml and per 15ml serving.",
    h1En: "Nutrition Label Maker for Extra Virgin Olive Oil (EVOO)",
    h1Es: "Etiqueta Nutricional para Aceite de Oliva Virgen Extra (AOVE)",
    subtitleEn:
      "Compliant with EU Regulation 1169/2011 and US FDA export labeling for olive oil producers and mills.",
    subtitleEs:
      "Conforme al Reglamento UE 1169/2011 y normativa FDA para almazaras y envasadores de AOVE.",
    productNameEn: "Organic Extra Virgin Olive Oil",
    productNameEs: "Aceite de Oliva Virgen Extra Ecológico",
    evaporationPercent: 0,
    servingsCount: 33,
    recipeItems: [{ ingredientId: "aceite-oliva-virgen-extra", amountGrams: 500 }],
    faqQuestionEn: "What are the nutrition values for 100g of Extra Virgin Olive Oil?",
    faqAnswerEn:
      "100g of Extra Virgin Olive Oil provides approximately 3700 kJ / 900 kcal and 100g of fat (of which ~14g saturates), with 0g carbohydrates, 0g sugars, 0g protein, and 0g salt.",
  },
  {
    slug: "eu-wine-qr-code",
    navLabelEn: "EU Wine QR E-Label",
    navLabelEs: "QR Vinos UE 2021/2117",
    workMode: "wine",
    title: "Free EU Wine QR Code E-Label Generator (Regulation 2021/2117)",
    description:
      "100% Free EU Wine QR Code E-Label Generator under Regulation (EU) 2021/2117. Calculate wine energy (kJ/kcal per 100ml) from ABV% and sugar, and export a cookie-free QR code in 5 languages.",
    h1En: "Free EU Wine QR Code E-Label Generator (Reg. 2021/2117)",
    h1Es: "Generador Gratis de QR Nutricional para Vinos (UE 2021/2117)",
    subtitleEn:
      "No subscription, no tracking cookies. Calculate bottle energy (E) and generate your multi-language E-Label QR code in seconds.",
    subtitleEs:
      "Sin suscripciones ni cookies de rastreo. Calcula el valor energético E y descarga el QR oficial para tu botella.",
    productNameEn: "Reserva Red Wine 2024",
    productNameEs: "Vino Tinto Reserva 2024",
    evaporationPercent: 0,
    servingsCount: 7,
    recipeItems: [],
    faqQuestionEn: "Is this EU Wine QR E-Label generator really free with no annual fees?",
    faqAnswerEn:
      "Yes. Unlike commercial platforms charging €150–€400/year, NutriLabel encodes your wine's nutritional parameters directly into a self-contained, zero-cookie public E-Label URL at zero cost.",
  },
  {
    slug: "amazon-fba-food-label",
    navLabelEn: "Amazon FBA Food & Supplements",
    navLabelEs: "Etiquetas para Amazon FBA",
    workMode: "food",
    title: "Free Amazon FBA Compliant FDA & UK/EU Nutrition Label Generator",
    description:
      "Create high-resolution 300 DPI PNG and vector SVG nutrition labels compliant with Amazon Seller Central US (FDA) and Amazon UK/EU (1169/2011) grocery approval requirements.",
    h1En: "Amazon FBA Compliant Nutrition Label Generator (US FDA & UK/EU)",
    h1Es: "Generador de Etiquetas Nutricionales para Vender en Amazon FBA",
    subtitleEn:
      "Switch between US FDA Nutrition Facts and Europe/UK per-100g Nutrition Declaration with 1 click.",
    subtitleEs:
      "Alterna entre el formato de EE. UU. (FDA) y el europeo (UE/UK por 100 g) con un solo clic.",
    productNameEn: "Natural Almond & Whey Protein Bites",
    productNameEs: "Bocados Proteicos de Almendra y Avena",
    evaporationPercent: 5,
    servingsCount: 10,
    recipeItems: [
      { ingredientId: "almendra-cruda", amountGrams: 180 },
      { ingredientId: "copos-avena", amountGrams: 120 },
      { ingredientId: "miel-abeja", amountGrams: 60 },
      { ingredientId: "cacao-puro-polvo", amountGrams: 30 },
    ],
    faqQuestionEn: "What does Amazon Seller Central check on grocery nutrition labels?",
    faqAnswerEn:
      "Amazon verifies that the nutrition table matches the target marketplace regulation (FDA format for Amazon.com; Regulation 1169/2011 per-100g table with bold allergens for Amazon.co.uk, .de, .es, .fr, and .it).",
  },
];
