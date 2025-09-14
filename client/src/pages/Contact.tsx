import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { contactMessageValidation, type ContactFormData } from '@/lib/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Layout from '@/components/Layout';


const emergencyContacts = [
  { service: 'Police', number: '100', icon: '🚔' },
  { service: 'Fire Department', number: '101', icon: '🚒' },
  { service: 'Ambulance', number: '108', icon: '🚑' },
  { service: 'Tourist Helpline', number: '1363', icon: 'ℹ️' }
];

const faqs = [
  {
    question: 'What is the best time to visit Indore?',
    answer: 'The best time to visit Indore is from October to March when the weather is pleasant and perfect for sightseeing.'
  },
  {
    question: 'How to reach Indore?',
    answer: 'Indore is well-connected by air, rail, and road. The city has Devi Ahilya Bai Holkar Airport and is a major railway junction.'
  },
  {
    question: 'What are the must-try foods in Indore?',
    answer: 'Don\'t miss the famous poha-jalebi breakfast, garadu, samosa, and the vibrant street food scene at Sarafa Bazaar.'
  },
  {
    question: 'Where can I find accommodation?',
    answer: 'Indore offers accommodation options ranging from budget hotels to luxury resorts, concentrated around the city center and major attractions.'
  }
];

export default function ContactPage() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactMessageValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please check your connection and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <Layout 
      title="Contact Us - All About Indore"
      description="Get in touch with us for any questions about Indore tourism, travel tips, or feedback. Find emergency contacts and frequently asked questions."
    >
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about Indore or need travel assistance? We're here to help you plan your perfect visit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="firstName" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input data-testid="input-first-name" placeholder="Your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="lastName" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input data-testid="input-last-name" placeholder="Your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" data-testid="input-email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="subject" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tourism">Tourism Information</SelectItem>
                          <SelectItem value="travel">Travel Assistance</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="business">Business Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="message" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={6} data-testid="textarea-message" placeholder="Tell us how we can help you..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" data-testid="button-submit" disabled={contactMutation.isPending} className="w-full">
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold" data-testid="text-address-label">Address</h3>
                      <p className="text-muted-foreground" data-testid="text-address">
                        Indore, Madhya Pradesh, India<br />
                        Heart of India - 452001
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground" data-testid="text-email">info@allaboutindore.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground" data-testid="text-phone">+91 731 XXX XXXX</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Emergency Contacts</h3>
                <div className="grid grid-cols-2 gap-4">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.service} className="bg-card p-4 rounded-lg border border-border text-center" data-testid={`emergency-${contact.service.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="text-2xl mb-2">{contact.icon}</div>
                      <div className="font-semibold text-sm">{contact.service}</div>
                      <div className="text-primary font-bold">{contact.number}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-card p-6 rounded-lg border border-border"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`faq-${index}`}
                >
                  <h3 className="font-semibold mb-3 text-primary">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}