import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    alt: "Fine dining ambiance",
    category: "interior",
  },
  {
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    alt: "Signature steak dish",
    category: "food",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    alt: "Restaurant interior",
    category: "interior",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    alt: "Gourmet presentation",
    category: "food",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    alt: "Elegant dining room",
    category: "interior",
  },
  {
    src: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80",
    alt: "Wine selection",
    category: "drinks",
  },
  {
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    alt: "Dessert plating",
    category: "food",
  },
  {
    src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80",
    alt: "Bar area",
    category: "interior",
  },
  {
    src: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80",
    alt: "Chef at work",
    category: "team",
  },
  {
    src: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80",
    alt: "Kitchen team",
    category: "team",
  },
  {
    src: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
    alt: "Appetizer presentation",
    category: "food",
  },
  {
    src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    alt: "Private dining",
    category: "interior",
  },
  {
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    alt: "Wine pouring",
    category: "drinks",
  },
  {
    src: "https://images.unsplash.com/photo-1482275548304-a58859dc31b7?w=800&q=80",
    alt: "Seafood dish",
    category: "food",
  },
  {
    src: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&q=80",
    alt: "Table setting",
    category: "interior",
  },
  {
    src: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80",
    alt: "Cocktail crafting",
    category: "drinks",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "food", label: "Cuisine" },
  { id: "interior", label: "Interior" },
  { id: "drinks", label: "Drinks" },
  { id: "team", label: "Team" },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        className="relative h-[40vh] min-h-[300px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <p className="font-sans text-sm uppercase tracking-[0.3em] mb-4 text-gold">
            Visual Journey
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-shadow">
            Gallery
          </h1>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-muted-foreground font-sans max-w-2xl mx-auto">
              Experience the beauty of Café Fausse through our curated collection 
              of photographs, showcasing our cuisine, ambiance, and the passion 
              that goes into every detail.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 font-sans text-sm uppercase tracking-widest rounded-md transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-sans text-sm uppercase tracking-wider">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none">
          <div className="relative">
            {selectedImage !== null && (
              <>
                <img
                  src={filteredImages[selectedImage].src}
                  alt={filteredImages[selectedImage].alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-sans text-sm">
                  {selectedImage + 1} / {filteredImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Instagram CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container max-w-3xl text-center">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-accent mb-4">
            Follow Our Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-medium mb-6">
            @CafeFausse
          </h2>
          <p className="text-primary-foreground/80 font-sans mb-8">
            Follow us on Instagram for behind-the-scenes glimpses, seasonal 
            specials, and the latest from our kitchen.
          </p>
          <a
            href="#"
            className="btn-elegant-outline border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary inline-flex"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </div>
  );
}
