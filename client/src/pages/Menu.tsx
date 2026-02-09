import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const heroImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80";

const menuCategories = {
  appetizers: {
    title: "Appetizers",
    description: "Begin your culinary journey with our carefully crafted starters",
    items: [
      {
        name: "Seared Foie Gras",
        description: "Pan-seared foie gras with caramelized figs, brioche toast, and aged balsamic reduction",
        price: 42,
        dietary: [],
      },
      {
        name: "Oysters Rockefeller",
        description: "Fresh East Coast oysters baked with spinach, Pernod, and herb breadcrumbs",
        price: 36,
        dietary: [],
      },
      {
        name: "Burrata Caprese",
        description: "Creamy burrata with heirloom tomatoes, basil oil, and 25-year aged balsamic",
        price: 28,
        dietary: ["vegetarian"],
      },
      {
        name: "Tuna Tartare",
        description: "Yellowfin tuna with avocado, sesame, ginger, and crispy wonton chips",
        price: 34,
        dietary: [],
      },
      {
        name: "French Onion Soup",
        description: "Classic preparation with Gruyère crouton and caramelized Vidalia onions",
        price: 18,
        dietary: ["vegetarian"],
      },
      {
        name: "Lobster Bisque",
        description: "Velvety Maine lobster bisque with cognac cream and chive oil",
        price: 24,
        dietary: [],
      },
    ],
  },
  mains: {
    title: "Main Courses",
    description: "Exceptional entrées crafted with the finest seasonal ingredients",
    items: [
      {
        name: "Filet Mignon",
        description: "8oz prime beef tenderloin with truffle pomme purée, asparagus, and red wine jus",
        price: 68,
        dietary: [],
      },
      {
        name: "Wagyu Ribeye",
        description: "A5 Japanese Wagyu with roasted bone marrow, charred shallots, and herb butter",
        price: 145,
        dietary: [],
      },
      {
        name: "Pan-Roasted Duck Breast",
        description: "Magret duck with cherry gastrique, wild rice pilaf, and baby vegetables",
        price: 52,
        dietary: [],
      },
      {
        name: "Dover Sole Meunière",
        description: "Whole Dover sole with brown butter, capers, lemon, and parsley potatoes",
        price: 78,
        dietary: [],
      },
      {
        name: "Butter-Poached Lobster",
        description: "Maine lobster tail with champagne beurre blanc, fingerling potatoes, and haricots verts",
        price: 85,
        dietary: [],
      },
      {
        name: "Rack of Lamb",
        description: "Herb-crusted Colorado lamb with ratatouille, olive tapenade, and rosemary jus",
        price: 62,
        dietary: [],
      },
      {
        name: "Wild Mushroom Risotto",
        description: "Arborio rice with porcini, chanterelles, truffle oil, and aged Parmesan",
        price: 38,
        dietary: ["vegetarian"],
      },
      {
        name: "Seared Scallops",
        description: "Day-boat scallops with cauliflower purée, pancetta, and brown butter",
        price: 48,
        dietary: [],
      },
    ],
  },
  desserts: {
    title: "Desserts",
    description: "Indulgent finales to complete your dining experience",
    items: [
      {
        name: "Chocolate Soufflé",
        description: "Warm Valrhona chocolate soufflé with crème anglaise (20 min preparation)",
        price: 18,
        dietary: ["vegetarian"],
      },
      {
        name: "Crème Brûlée",
        description: "Classic Madagascar vanilla bean custard with caramelized sugar crust",
        price: 14,
        dietary: ["vegetarian"],
      },
      {
        name: "Tarte Tatin",
        description: "Caramelized apple tart with Calvados ice cream and salted caramel",
        price: 16,
        dietary: ["vegetarian"],
      },
      {
        name: "Lemon Posset",
        description: "Silky citrus cream with fresh berries and shortbread crumble",
        price: 14,
        dietary: ["vegetarian"],
      },
      {
        name: "Cheese Selection",
        description: "Curated artisanal cheeses with honeycomb, nuts, and seasonal fruit",
        price: 24,
        dietary: ["vegetarian"],
      },
      {
        name: "Mille-Feuille",
        description: "Crisp puff pastry layers with vanilla pastry cream and fresh strawberries",
        price: 16,
        dietary: ["vegetarian"],
      },
    ],
  },
};

const wineCategories = [
  { name: "Champagne & Sparkling", priceRange: "$65 - $450" },
  { name: "White Wines", priceRange: "$55 - $280" },
  { name: "Red Wines", priceRange: "$60 - $850" },
  { name: "Dessert Wines", priceRange: "$18 - $95 (glass)" },
];

export default function Menu() {
  const [activeTab, setActiveTab] = useState("appetizers");

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <p className="font-sans text-sm uppercase tracking-[0.3em] mb-4 text-gold">
            Culinary Excellence
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-shadow">
            Our Menu
          </h1>
        </div>
      </section>

      {/* Menu Content */}
      <section className="section-padding bg-background">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-muted-foreground font-sans max-w-2xl mx-auto">
              Our menu celebrates the art of fine dining, featuring seasonal ingredients 
              sourced from local farms and trusted purveyors around the world.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-center mb-12 bg-transparent gap-2 flex-wrap">
              {Object.entries(menuCategories).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="font-sans text-sm uppercase tracking-widest px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(menuCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-medium mb-4">{category.title}</h2>
                  <p className="text-muted-foreground font-sans">{category.description}</p>
                  <div className="divider-elegant">
                    <span className="text-gold">✦</span>
                  </div>
                </div>

                <div className="space-y-8">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-8 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-medium">{item.name}</h3>
                          {item.dietary.includes("vegetarian") && (
                            <span className="text-xs font-sans uppercase tracking-wider text-green-600 bg-green-100 px-2 py-0.5 rounded">
                              V
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-xl font-medium text-primary sm:text-right">
                        ${item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Wine Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-accent mb-4">
            Curated Selection
          </p>
          <h2 className="text-4xl md:text-5xl font-medium mb-6">Wine List</h2>
          <p className="text-primary-foreground/80 font-sans mb-12 max-w-2xl mx-auto">
            Our sommelier has curated an exceptional collection of wines from 
            renowned vineyards across the globe, perfectly paired with our cuisine.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wineCategories.map((wine, index) => (
              <div
                key={index}
                className="bg-primary-foreground/10 p-6 rounded-lg border border-primary-foreground/20"
              >
                <h3 className="text-xl font-medium mb-2">{wine.name}</h3>
                <p className="text-accent font-sans">{wine.priceRange}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-primary-foreground/60 font-sans">
            Full wine list available upon request. Ask our sommelier for pairing recommendations.
          </p>
        </div>
      </section>

      {/* Tasting Menu Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container max-w-3xl text-center">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
            Chef's Selection
          </p>
          <h2 className="text-4xl md:text-5xl font-medium mb-6">Tasting Menu</h2>
          <p className="text-muted-foreground font-sans mb-8">
            Experience the full breadth of our culinary artistry with our signature 
            tasting menu, featuring five courses of seasonal inspiration.
          </p>
          <div className="bg-card p-8 rounded-lg border border-border">
            <h3 className="text-2xl font-medium mb-4">Five-Course Tasting Experience</h3>
            <p className="text-muted-foreground font-sans mb-6">
              A curated journey through our kitchen's finest creations, 
              showcasing the season's best ingredients.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-medium text-primary">$145</p>
                <p className="text-sm text-muted-foreground font-sans">per person</p>
              </div>
              <div>
                <p className="text-3xl font-medium text-primary">$95</p>
                <p className="text-sm text-muted-foreground font-sans">wine pairing</p>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground font-sans">
            Please inform us of any dietary restrictions or allergies when making your reservation.
          </p>
        </div>
      </section>
    </div>
  );
}
