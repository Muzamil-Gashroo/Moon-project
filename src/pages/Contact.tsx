/**
 * Contact Page
 * Contact form with advanced validation
 */

import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm, validationRules } from '@/hooks/useForm';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const form = useForm<ContactFormData>({
    fields: {
      name: {
        initialValue: '',
        rules: [
          validationRules.required('Name is required'),
          validationRules.minLength(2, 'Name must be at least 2 characters'),
        ],
      },
      email: {
        initialValue: '',
        rules: [
          validationRules.required('Email is required'),
          validationRules.email(),
        ],
      },
      phone: {
        initialValue: '',
        rules: [
          validationRules.required('Phone number is required'),
          validationRules.phone(),
        ],
      },
      message: {
        initialValue: '',
        rules: [
          validationRules.required('Message is required'),
          validationRules.minLength(10, 'Message must be at least 10 characters'),
          validationRules.maxLength(500, 'Message must be less than 500 characters'),
        ],
      },
    },
    onSubmit: async (values) => {
      // Simulate async submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      //  you would send this to an API
      console.log('Form submitted:', values);
      
      toast({
        title: 'Message sent successfully!',
        description: 'We will get back to you as soon as possible.',
      });
    },
  });

  return (
    <div className="min-h-screen py-12 gradient-warm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:info@monnn.com"
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      dummy@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a
                      href="tel:+919876543210"
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      +91 00000 00000
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      kanispora <br />
                      baramulla, jammu and kashmir 193103<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-soft">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Monday - Saturday: 9:00 AM - 8:00 PM<br />
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-lg p-8 shadow-soft">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={form.handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={form.values.name}
                  onChange={(e) => form.handleChange('name')(e.target.value)}
                  onBlur={form.handleBlur('name')}
                  className={form.errors.name?.touched && form.errors.name?.message ? 'border-destructive' : ''}
                />
                {form.errors.name?.touched && form.errors.name?.message && (
                  <p className="text-sm text-destructive mt-1">{form.errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.values.email}
                  onChange={(e) => form.handleChange('email')(e.target.value)}
                  onBlur={form.handleBlur('email')}
                  className={form.errors.email?.touched && form.errors.email?.message ? 'border-destructive' : ''}
                />
                {form.errors.email?.touched && form.errors.email?.message && (
                  <p className="text-sm text-destructive mt-1">{form.errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.values.phone}
                  onChange={(e) => form.handleChange('phone')(e.target.value)}
                  onBlur={form.handleBlur('phone')}
                  className={form.errors.phone?.touched && form.errors.phone?.message ? 'border-destructive' : ''}
                />
                {form.errors.phone?.touched && form.errors.phone?.message && (
                  <p className="text-sm text-destructive mt-1">{form.errors.phone.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.values.message}
                  onChange={(e) => form.handleChange('message')(e.target.value)}
                  onBlur={form.handleBlur('message')}
                  className={form.errors.message?.touched && form.errors.message?.message ? 'border-destructive' : ''}
                />
                {form.errors.message?.touched && form.errors.message?.message && (
                  <p className="text-sm text-destructive mt-1">{form.errors.message.message}</p>
                )}
              </div>

              {/* Submit Error */}
              {form.submitError && (
                <p className="text-sm text-destructive">{form.submitError}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={form.isSubmitting}
                className="w-full"
              >
                {form.isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
