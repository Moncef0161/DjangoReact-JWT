import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-lg"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="text-4xl mb-4 text-primary">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const Testimonial: React.FC<{ quote: string; author: string }> = ({
  quote,
  author,
}) => (
  <div className="bg-secondary/10 p-6 rounded-lg">
    <p className="text-lg mb-4">"{quote}"</p>
    <p className="font-semibold">- {author}</p>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Secure Authentication <br /> Made{" "}
            <span className="text-primary">Simple</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Protect your users and data with our state-of-the-art authentication
            system
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="mr-4">
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </section>

        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose AuthApp?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield />}
              title="Robust Security"
              description="Industry-leading encryption and security protocols to keep your data safe."
            />
            <FeatureCard
              icon={<Zap />}
              title="Lightning Fast"
              description="Optimized performance for quick and seamless authentication processes."
            />
            <FeatureCard
              icon={<Users />}
              title="User-Friendly"
              description="Intuitive interfaces designed for the best user experience."
            />
          </div>
        </section>

        <section className="py-20 bg-secondary/10 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground">
              Don't just take our word for it
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Testimonial
              quote="AuthApp has revolutionized our user authentication process. It's secure, fast, and our users love it!"
              author="Jane Doe, CEO of TechCorp"
            />
            <Testimonial
              quote="Implementing AuthApp was a breeze. It's saved us countless hours and improved our overall security."
              author="John Smith, CTO of StartupX"
            />
          </div>
        </section>

        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your App?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied developers and businesses
          </p>
          <Button size="lg">
            Start Your Free Trial <ArrowRight className="ml-2" />
          </Button>
        </section>
      </main>

      <footer className="bg-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold text-primary">AuthApp</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground">
            © 2023 AuthApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
