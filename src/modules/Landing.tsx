import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sofa, Armchair, Bed, Star, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import heroImage from '@/assets/furniture-hero.jpg';
import livingRoomImage from '@/assets/living-room.jpg';
import diningRoomImage from '@/assets/dining-room.jpg';
import bedroomImage from '@/assets/bedroom.jpg';
import logo from '/logo.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
       <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Vara Shidi Logo" className="h-8 w-32" />
          </div>

          <Button onClick={() => navigate('/')} className="gap-2">
            Login <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Vara Shidi furniture showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/30" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-left max-w-2xl">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            Elevate Your <span className="text-gradient-gold">Home Style</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            Discover inspired furniture from Vara Shidi—where comfort, quality, and unique craftsmanship meet.
          </p>
          <div className="flex gap-4 animate-fade-in">
            <Button size="lg" className="gap-2 text-lg px-8">
              Explore Collections <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Finest Materials</h3>
                <p className="text-muted-foreground">
                  Only premium woods and upholstery for elegant, long-lasting furniture.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Authentic Design</h3>
                <p className="text-muted-foreground">
                  Original, locally-inspired styles for your living spaces.
                </p>
              </CardContent>
            </Card>
            <Card className="hover-lift">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sofa className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Satisfaction Guarantee</h3>
                <p className="text-muted-foreground">
                  We’re devoted to your comfort and peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Vara Shidi <span className="text-gradient-gold">Collections</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated sets for every room—crafted locally, styled uniquely, built to last.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover-lift group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={livingRoomImage} 
                  alt="Living Room Collection" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Armchair className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-2xl font-bold text-white mb-1">Living Room</h3>
                  <p className="text-white/80">Sofas, Lounge Chairs & Coffee Tables</p>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden hover-lift group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={diningRoomImage} 
                  alt="Dining Room Collection" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Sofa className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-2xl font-bold text-white mb-1">Dining Room</h3>
                  <p className="text-white/80">Dining Tables, Sideboards & Chairs</p>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden hover-lift group cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={bedroomImage} 
                  alt="Bedroom Collection" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Bed className="h-8 w-8 text-primary mb-2" />
                  <h3 className="text-2xl font-bold text-white mb-1">Bedroom</h3>
                  <p className="text-white/80">Beds, Nightstands & Wardrobes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">About <span className="text-gradient-gold">Vara Shidi</span></h2>
            <p className="text-lg text-muted-foreground mb-6">
              Vara Shidi Furnitures celebrates the artistry of local Ethiopian craftsmen, blending timeless techniques with creative flair. Since our founding, every collection has been built with care, highlighting the warmth of wood and inspired designs unique to our culture.
            </p>
            <p className="text-lg text-muted-foreground">
              From city homes to countryside retreats, each Vara Shidi piece brings inviting comfort and handcrafted distinction to your spaces.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Contact <span className="text-gradient-gold">Us</span></h2>
              <p className="text-xl text-muted-foreground">
                Visit Vara Shidi showroom or reach out to discuss your furniture dreams.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover-lift">
                <CardContent className="pt-6 text-center">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+251 911 234 567</p>
                </CardContent>
              </Card>
              <Card className="hover-lift">
                <CardContent className="pt-6 text-center">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">info@varashidi.com</p>
                </CardContent>
              </Card>
              <Card className="hover-lift">
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Showroom</h3>
                  <p className="text-muted-foreground">Bole, Addis Ababa, Ethiopia</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sofa className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient-gold">Vara Shidi Furnitures</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Handcrafted comfort, made in Ethiopia.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 Vara Shidi Furnitures. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
