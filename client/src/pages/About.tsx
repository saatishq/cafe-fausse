import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Award, Star, Users, Utensils, Heart, Leaf } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=80";
const chefImage = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80";
const teamImage = "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80";
const interiorImage = "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80";

const milestones = [
  { year: "2010", event: "Café Fausse opens its doors in Manhattan" },
  { year: "2012", event: "First James Beard Award nomination" },
  { year: "2015", event: "Awarded first Michelin Star" },
  { year: "2018", event: "Expansion to private dining room" },
  { year: "2020", event: "Launch of seasonal tasting menu program" },
  { year: "2023", event: "James Beard Award for Outstanding Restaurant" },
  { year: "2024", event: "Second Michelin Star awarded" },
];

const values = [
  {
    icon: Utensils,
    title: "Culinary Excellence",
    description: "Every dish is crafted with precision, passion, and respect for ingredients.",
  },
  {
    icon: Heart,
    title: "Warm Hospitality",
    description: "We treat every guest as family, creating memorable experiences that last.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Committed to sustainable sourcing and minimizing our environmental impact.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Supporting local farmers, artisans, and the communities we serve.",
  },
];

const team = [
  {
    name: "Chef Antoine Dubois",
    role: "Executive Chef & Founder",
    bio: "With over 25 years of culinary experience across Michelin-starred kitchens in Paris and New York, Chef Antoine brings his passion for French cuisine and innovative techniques to every dish at Café Fausse.",
    image: chefImage,
  },
  {
    name: "Marie Laurent",
    role: "Pastry Chef",
    bio: "A graduate of Le Cordon Bleu, Marie's exquisite desserts have earned acclaim from critics worldwide. Her creations blend classic French pastry with modern artistry.",
    image: "https://images.unsplash.com/photo-1583394293214-28ez9ce8cec1?w=400&q=80",
  },
  {
    name: "James Chen",
    role: "Sommelier",
    bio: "A certified Master Sommelier, James has curated our award-winning wine program featuring over 500 selections from the world's finest vineyards.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
];

export default function About() {
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
            Our Story
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-shadow">
            About Us
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
                Since 2010
              </p>
              <h2 className="text-4xl md:text-5xl font-medium mb-6">
                A Passion for Perfection
              </h2>
              <div className="space-y-4 text-muted-foreground font-sans leading-relaxed">
                <p>
                  Café Fausse was born from a simple yet profound belief: that dining 
                  should be an experience that engages all the senses and creates 
                  lasting memories. Founded by Chef Antoine Dubois in 2010, our 
                  restaurant has become a destination for those who appreciate the 
                  art of fine cuisine.
                </p>
                <p>
                  Our name, "Fausse," meaning "false" in French, speaks to our 
                  philosophy of challenging expectations. What appears simple on the 
                  plate reveals layers of complexity; what seems familiar transforms 
                  into something extraordinary. We invite our guests to question, 
                  discover, and ultimately be delighted.
                </p>
                <p>
                  Every element of Café Fausse has been carefully considered, from 
                  the hand-selected ingredients sourced from local farms and trusted 
                  purveyors, to the elegant yet welcoming atmosphere that makes every 
                  guest feel at home.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={interiorImage}
                alt="Restaurant interior"
                className="w-full h-[500px] object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
              What We Stand For
            </p>
            <h2 className="text-4xl md:text-5xl font-medium">Our Values</h2>
            <div className="divider-elegant">
              <span className="text-gold">✦</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
              The People Behind the Magic
            </p>
            <h2 className="text-4xl md:text-5xl font-medium">Meet Our Team</h2>
            <div className="divider-elegant">
              <span className="text-gold">✦</span>
            </div>
          </div>

          {/* Featured Chef */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
            <div className="relative">
              <img
                src={team[0].image}
                alt={team[0].name}
                className="w-full h-[500px] object-cover rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg hidden md:block">
                <p className="font-sans text-sm uppercase tracking-wider mb-1">Experience</p>
                <p className="text-3xl font-medium">25+ Years</p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-medium mb-2">{team[0].name}</h3>
              <p className="text-gold font-sans text-sm uppercase tracking-wider mb-6">
                {team[0].role}
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                {team[0].bio}
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed">
                Chef Antoine's culinary journey began in his grandmother's kitchen in 
                Lyon, France. After training under legendary chefs in Paris, he brought 
                his expertise to New York, where he spent a decade refining his craft 
                before opening Café Fausse. His philosophy centers on respecting 
                ingredients and creating dishes that tell a story.
              </p>
            </div>
          </div>

          {/* Other Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.slice(1).map((member, index) => (
              <div key={index} className="flex gap-6 bg-card p-6 rounded-lg border border-border">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                  <p className="text-gold font-sans text-xs uppercase tracking-wider mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-accent mb-4">
              Our Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-medium">Milestones</h2>
            <div className="divider-elegant">
              <span className="text-accent">✦</span>
            </div>
          </div>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center gap-6 bg-primary-foreground/10 p-6 rounded-lg border border-primary-foreground/20"
              >
                <div className="flex-shrink-0 w-20 text-center">
                  <span className="text-2xl font-medium text-accent">{milestone.year}</span>
                </div>
                <div className="h-px flex-shrink-0 w-8 bg-primary-foreground/30" />
                <p className="font-sans">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="section-padding bg-background">
        <div className="container text-center">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
            Recognition
          </p>
          <h2 className="text-4xl md:text-5xl font-medium mb-12">
            Awards & Accolades
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-4 bg-card px-8 py-6 rounded-lg border border-border">
              <Star className="h-10 w-10 text-gold fill-gold" />
              <div className="text-left">
                <p className="text-2xl font-medium">2 Michelin Stars</p>
                <p className="text-sm text-muted-foreground font-sans">2024</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-card px-8 py-6 rounded-lg border border-border">
              <Award className="h-10 w-10 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-medium">James Beard Award</p>
                <p className="text-sm text-muted-foreground font-sans">Outstanding Restaurant 2023</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-card px-8 py-6 rounded-lg border border-border">
              <Award className="h-10 w-10 text-primary" />
              <div className="text-left">
                <p className="text-2xl font-medium">Wine Spectator</p>
                <p className="text-sm text-muted-foreground font-sans">Grand Award 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-medium mb-6">
            Experience the Café Fausse Difference
          </h2>
          <p className="text-muted-foreground font-sans mb-8 max-w-2xl mx-auto">
            We invite you to join us for an unforgettable dining experience. 
            Let us share our passion for exceptional cuisine and warm hospitality with you.
          </p>
          <Link href="/reservations">
            <Button className="btn-elegant">Make a Reservation</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
