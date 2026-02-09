import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { reservationApi, type SlotAvailability, type ReservationDetails } from "@/lib/api";
import { toast } from "sonner";
import { CalendarDays, Clock, Users, CheckCircle2, MapPin, Phone } from "lucide-react";
import { format, addDays, isBefore, startOfToday } from "date-fns";

const heroImage = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1920&q=80";

const timeSlots = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30"
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Reservations() {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(today, 1));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [guestCount, setGuestCount] = useState<string>("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [newsletterSignup, setNewsletterSignup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);
  const [availabilityData, setAvailabilityData] = useState<SlotAvailability[] | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const dateString = useMemo(() => {
    return selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  }, [selectedDate]);

  // Fetch availability when date changes
  useEffect(() => {
    if (!dateString) return;

    let cancelled = false;
    setIsLoadingAvailability(true);

    reservationApi.getAvailableSlots(dateString)
      .then((data) => {
        if (!cancelled) {
          setAvailabilityData(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load availability:", err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingAvailability(false);
        }
      });

    return () => { cancelled = true; };
  }, [dateString]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await reservationApi.create({
        name,
        email,
        phone: phone || undefined,
        date: dateString,
        timeSlot: selectedTime,
        guestCount: parseInt(guestCount),
        specialRequests: specialRequests || undefined,
        newsletterSignup,
      });

      if (data.success && data.reservation) {
        setIsSubmitted(true);
        setReservationDetails(data.reservation);
        toast.success(data.message);
      } else {
        toast.error(data.error || "Failed to create reservation");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setReservationDetails(null);
    setSelectedDate(addDays(today, 1));
    setSelectedTime("");
    setGuestCount("2");
    setName("");
    setEmail("");
    setPhone("");
    setSpecialRequests("");
    setNewsletterSignup(false);
  };

  if (isSubmitted && reservationDetails) {
    return (
      <div className="pt-20">
        <section className="section-padding bg-background">
          <div className="container max-w-2xl text-center">
            <div className="bg-card p-8 md:p-12 rounded-lg border border-border">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-medium mb-4">
                Reservation Confirmed
              </h1>
              <p className="text-muted-foreground font-sans mb-8">
                Thank you for choosing Café Fausse. We look forward to welcoming you.
              </p>

              <div className="bg-secondary/30 p-6 rounded-lg mb-8">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-1">Date</p>
                    <p className="font-medium">{format(new Date(reservationDetails.date), "EEEE, MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-1">Time</p>
                    <p className="font-medium">{reservationDetails.timeSlot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-1">Guests</p>
                    <p className="font-medium">{reservationDetails.guestCount} {reservationDetails.guestCount === 1 ? "Guest" : "Guests"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-1">Table</p>
                    <p className="font-medium">Table #{reservationDetails.tableNumber}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground font-sans mb-8">
                <p>A confirmation email has been sent to <strong className="text-foreground">{email}</strong></p>
                <p>Please arrive 10-15 minutes before your reservation time.</p>
                <p>For any changes, please call us at <strong className="text-foreground">(212) 555-0123</strong></p>
              </div>

              <Button onClick={resetForm} className="btn-elegant">
                Make Another Reservation
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
            Join Us
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-shadow">
            Reservations
          </h1>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card p-6 md:p-8 rounded-lg border border-border">
                <h2 className="text-2xl md:text-3xl font-medium mb-6">
                  Book Your Table
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-base font-medium mb-4 flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      Select Date
                    </Label>
                    <div className="mt-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => isBefore(date, today)}
                        className="rounded-md border mx-auto"
                      />
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <Label className="text-base font-medium mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Select Time
                    </Label>
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {timeSlots.map((slot) => {
                        const slotData = availabilityData?.find((s) => s.timeSlot === slot);
                        const isAvailable = slotData?.available ?? true;
                        const isSelected = selectedTime === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-3 px-2 text-sm font-sans rounded-md border transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary"
                                : isAvailable
                                ? "bg-background hover:border-primary hover:text-primary"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    {isLoadingAvailability && (
                      <p className="text-sm text-muted-foreground font-sans mt-2">
                        Checking availability...
                      </p>
                    )}
                  </div>

                  {/* Guest Count */}
                  <div>
                    <Label className="text-base font-medium mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Number of Guests
                    </Label>
                    <Select value={guestCount} onValueChange={setGuestCount}>
                      <SelectTrigger className="w-full mt-3 h-12 font-sans">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {guestOptions.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="font-sans text-sm">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="mt-2 h-12 font-sans"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-sans text-sm">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="mt-2 h-12 font-sans"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="font-sans text-sm">
                        Phone Number (optional)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-2 h-12 font-sans"
                        placeholder="(212) 555-0123"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="requests" className="font-sans text-sm">
                      Special Requests (optional)
                    </Label>
                    <Textarea
                      id="requests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="mt-2 font-sans min-h-[100px]"
                      placeholder="Dietary restrictions, special occasions, seating preferences..."
                    />
                  </div>

                  {/* Newsletter Signup */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="newsletter"
                      checked={newsletterSignup}
                      onCheckedChange={(checked) => setNewsletterSignup(checked === true)}
                    />
                    <Label htmlFor="newsletter" className="font-sans text-sm cursor-pointer">
                      Subscribe to our newsletter for exclusive offers and updates
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="btn-elegant w-full"
                    disabled={isSubmitting || !selectedDate || !selectedTime}
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Reservation"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-medium mb-4">Contact Us</h3>
                <div className="space-y-4 font-sans text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        123 Gourmet Avenue<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">(212) 555-0123</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-medium mb-4">Hours</h3>
                <div className="space-y-2 font-sans text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tuesday - Thursday</span>
                    <span>5PM - 10PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Friday - Saturday</span>
                    <span>5PM - 11PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span>5PM - 9PM</span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span>Monday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Policies Card */}
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4">Reservation Policies</h3>
                <ul className="space-y-3 font-sans text-sm text-muted-foreground">
                  <li>• Reservations are held for 15 minutes</li>
                  <li>• For parties larger than 10, please call us directly</li>
                  <li>• Cancellations must be made 24 hours in advance</li>
                  <li>• Smart casual dress code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
