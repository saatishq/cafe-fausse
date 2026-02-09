import { Link } from "wouter";
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-medium mb-4">Café Fausse</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed font-sans">
              An elegant fine-dining experience where culinary artistry meets 
              timeless sophistication. Join us for an unforgettable evening.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <div className="space-y-3 font-sans text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80">
                  123 Gourmet Avenue<br />
                  New York, NY 10001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/80">(212) 555-0123</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/80">info@cafefausse.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-medium mb-4">Hours</h4>
            <div className="space-y-2 font-sans text-sm text-primary-foreground/80">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 text-accent" />
                <div>
                  <p>Tuesday - Thursday</p>
                  <p>5:00 PM - 10:00 PM</p>
                </div>
              </div>
              <div className="ml-8">
                <p>Friday - Saturday</p>
                <p>5:00 PM - 11:00 PM</p>
              </div>
              <div className="ml-8">
                <p>Sunday</p>
                <p>5:00 PM - 9:00 PM</p>
              </div>
              <div className="ml-8 text-accent">
                <p>Monday - Closed</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <div className="space-y-2 font-sans text-sm">
              <Link href="/menu" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Our Menu
              </Link>
              <Link href="/reservations" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Make a Reservation
              </Link>
              <Link href="/about" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                About Us
              </Link>
              <Link href="/gallery" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Gallery
              </Link>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-sans text-primary-foreground/60">
              © {new Date().getFullYear()} Café Fausse. All rights reserved.
            </p>
            <p className="text-sm font-sans text-primary-foreground/60">
              Crafted with passion for fine dining
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
