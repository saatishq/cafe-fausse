import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterApi } from "@/lib/api";
import { toast } from "sonner";
import { Star, Award, Utensils, Wine, Clock, Users } from "lucide-react";

// Restaurant images
const heroImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80";
const interiorImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
const dishImage = "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80";
const chefImage = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80";

const features = [
  {
    icon: Utensils,
    title: "Exquisite Cuisine",
    description: "Our award-winning chefs craft each dish with precision and passion, using only the finest seasonal ingredients.",
  },
  {
    icon: Wine,
    title: "Curated Wine Selection",
    description: "An extensive collection of rare vintages and exceptional wines, carefully selected by our sommelier.",
  },
  {
    icon: Users,
    title: "Impeccable Service",
    description: "Our dedicated team ensures every moment of your dining experience exceeds expectations.",
  },
];

const awards = [
  { name: "Michelin Star", year: "2024" },
  { name: "James Beard Award", year: "2023" },
  { name: "Wine Spectator Award", year: "2024" },
];

const reviews = [
  {
    text: "An extraordinary culinary journey. Every dish was a masterpiece of flavor and presentation.",
    author: "The New York Times",
    rating: 5,
  },
  {
    text: "Café Fausse sets the standard for fine dining. Impeccable service and unforgettable cuisine.",
    author: "Food & Wine Magazine",
    rating: 5,
  },
  {
    text: "A dining experience that transcends the ordinary. Simply magnificent.",
    author: "Zagat",
    rating: 5,
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    try {
      const data = await newsletterApi.subscribe(email, name || undefined);
      toast.success(data.message);
      setEmail("");
      setName("");
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <p className="font-sans text-sm uppercase tracking-[0.3em] mb-4 text-gold">
            Fine Dining Experience
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium mb-6 text-shadow">
            Café Fausse
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
            Where culinary artistry meets timeless elegance. Experience the extraordinary
            in every bite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations">
              <Button className="btn-elegant bg-white text-primary hover:bg-white/90">
                Reserve Your Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button className="btn-elegant-outline border-white text-white hover:bg-white hover:text-primary">
                View Our Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
              Why Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground">
              The Café Fausse Experience
            </h2>
            <div className="divider-elegant">
              <span className="text-gold">✦</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-medium mb-4">{feature.title}</h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <img
                src={interiorImage}
                alt="Restaurant interior"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg hidden md:block">
                <p className="font-sans text-sm uppercase tracking-wider mb-1">Established</p>
                <p className="text-3xl font-medium">2010</p>
              </div>
            </div>
            <div>
              <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
                Our Story
              </p>
              <h2 className="text-4xl md:text-5xl font-medium mb-6">
                A Legacy of Excellence
              </h2>
              <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                For over a decade, Café Fausse has been a beacon of culinary excellence 
                in the heart of New York City. Founded by Chef Antoine Dubois, our 
                restaurant combines classic French techniques with innovative modern 
                approaches to create an unforgettable dining experience.
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed mb-8">
                Every dish tells a story, every ingredient is carefully sourced, and 
                every guest is treated like family. This is the philosophy that has 
                earned us recognition from the world's most prestigious culinary institutions.
              </p>
              <Link href="/about">
                <Button className="btn-elegant-outline">Discover Our Story</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Reviews Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-16">
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-accent mb-4">
              Recognition
            </p>
            <h2 className="text-4xl md:text-5xl font-medium">
              Awards & Accolades
            </h2>
            <div className="divider-elegant">
              <span className="text-accent">✦</span>
            </div>
          </div>

          {/* Awards */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {awards.map((award, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-primary-foreground/10 px-6 py-4 rounded-lg"
              >
                <Award className="h-8 w-8 text-accent" />
                <div>
                  <p className="font-medium">{award.name}</p>
                  <p className="text-sm text-primary-foreground/70 font-sans">{award.year}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-primary-foreground/5 p-8 rounded-lg border border-primary-foreground/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-primary-foreground/90 italic mb-4 font-light leading-relaxed">
                  "{review.text}"
                </p>
                <p className="font-sans text-sm text-accent">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
                Culinary Excellence
              </p>
              <h2 className="text-4xl md:text-5xl font-medium mb-6">
                Seasonal Tasting Menu
              </h2>
              <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                Our ever-evolving menu celebrates the finest seasonal ingredients, 
                transformed by our culinary team into extraordinary dishes that 
                delight the senses and nourish the soul.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-sans text-sm">5-Course Tasting Menu Available</span>
                </div>
                <div className="flex items-center gap-4">
                  <Wine className="h-5 w-5 text-primary" />
                  <span className="font-sans text-sm">Wine Pairing Options</span>
                </div>
                <div className="flex items-center gap-4">
                  <Utensils className="h-5 w-5 text-primary" />
                  <span className="font-sans text-sm">Vegetarian & Dietary Options</span>
                </div>
              </div>
              <Link href="/menu">
                <Button className="btn-elegant">Explore Our Menu</Button>
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src={dishImage}
                alt="Signature dish"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container max-w-2xl text-center">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
            Stay Connected
          </p>
          <h2 className="text-4xl md:text-5xl font-medium mb-6">
            Join Our Newsletter
          </h2>
          <p className="text-muted-foreground font-sans mb-8">
            Subscribe to receive exclusive updates on special events, seasonal menus, 
            and members-only dining experiences.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Your Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-12 font-sans bg-background"
              />
              <Input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 font-sans bg-background"
              />
            </div>
            <Button
              type="submit"
              className="btn-elegant w-full sm:w-auto"
              disabled={isSubscribing}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-24 md:py-32"
        style={{
          backgroundImage: `url(${chefImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container text-center text-white">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-shadow">
            Reserve Your Experience
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto font-sans">
            Join us for an unforgettable evening of exceptional cuisine, 
            impeccable service, and timeless elegance.
          </p>
          <Link href="/reservations">
            <Button className="btn-elegant bg-white text-primary hover:bg-white/90">
              Make a Reservation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
