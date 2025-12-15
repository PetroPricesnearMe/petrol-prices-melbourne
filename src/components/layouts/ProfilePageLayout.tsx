/**
 * Directory Profile Page Layout
 *
 * Comprehensive profile page with banner, image gallery, about section, and contact form
 *
 * @module components/layouts/ProfilePageLayout
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

interface ProfilePageLayoutProps {
  profile: {
    id: string;
    name: string;
    title: string;
    description: string;
    bannerImage: string;
    profileImage: string;
    images: string[];
    about: string;
    services: string[];
    contact: {
      email: string;
      phone: string;
      address: string;
      website?: string;
      socialMedia?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
      };
    };
    stats: {
      yearsExperience: number;
      projectsCompleted: number;
      clientsServed: number;
      rating: number;
    };
  };
  className?: string;
}

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  className?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// ============================================================================
// IMAGE GALLERY COMPONENT
// ============================================================================

/**
 * Responsive image gallery with lightbox functionality
 */
function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4',
          className
        )}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openLightbox(image, index)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div className="relative max-h-full max-w-4xl">
              <Image
                src={images[currentIndex]}
                alt={`Gallery image ${currentIndex + 1}`}
                width={800}
                height={600}
                className="max-h-[80vh] rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-2 transition-colors duration-200 hover:bg-white/30"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/20 p-2 transition-colors duration-200 hover:bg-white/30"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors duration-200 hover:bg-white/30"
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-white/20 px-4 py-2">
                <span className="text-sm text-white">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// CONTACT FORM COMPONENT
// ============================================================================

/**
 * Contact form with validation and submission handling
 */
function ContactForm({ onSubmit, className }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitTimestamp, setSubmitTimestamp] = useState<number | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 254) {
      newErrors.email = 'Email address is too long';
    }

    // Phone validation (optional but validate format if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      } else if (formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = 'Phone number must contain at least 10 digits';
      }
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = 'Message must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam: Check honeypot field (should be empty)
    if (honeypot) {
      // Silently reject - don't show error to user
      return;
    }

    // Anti-spam: Check submission timing (prevent too-fast submissions)
    const now = Date.now();
    if (submitTimestamp && now - submitTimestamp < 2000) {
      // Silently reject submissions faster than 2 seconds
      return;
    }
    setSubmitTimestamp(now);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setHoneypot('');
      setSubmitTimestamp(null);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      noValidate
      aria-label="Contact form"
    >
      {/* Honeypot field - hidden from users, visible to bots */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <label htmlFor="website-url">Website URL</label>
        <input
          type="text"
          id="website-url"
          name="website-url"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={cn(
              'w-full rounded-lg border px-4 py-3',
              'bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-600',
              'text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'focus:border-primary-500 dark:focus:border-primary-400',
              'transition-colors duration-200',
              'min-h-[44px]',
              errors.name && 'border-red-500 focus:ring-red-500'
            )}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-red-600 dark:text-red-400 text-sm"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={cn(
              'w-full rounded-lg border px-4 py-3',
              'bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-600',
              'text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'focus:border-primary-500 dark:focus:border-primary-400',
              'transition-colors duration-200',
              'min-h-[44px]',
              errors.email && 'border-red-500 focus:ring-red-500'
            )}
            placeholder="Enter your email address"
            autoComplete="email"
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-red-600 dark:text-red-400 text-sm"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Phone Number <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={cn(
            'w-full rounded-lg border px-4 py-3',
            'bg-white dark:bg-gray-800',
            'border-gray-300 dark:border-gray-600',
            'text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'focus:border-primary-500 dark:focus:border-primary-400',
            'transition-colors duration-200',
            'min-h-[44px]',
            errors.phone && 'border-red-500 focus:ring-red-500'
          )}
          placeholder="Enter your phone number"
          autoComplete="tel"
        />
        {errors.phone && (
          <p
            id="phone-error"
            className="text-red-600 dark:text-red-400 text-sm"
            role="alert"
          >
            {errors.phone}
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Subject{' '}
          <span className="text-red-500" aria-label="required">
            *
          </span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className={cn(
            'w-full rounded-lg border px-4 py-3',
            'bg-white dark:bg-gray-800',
            'border-gray-300 dark:border-gray-600',
            'text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'focus:border-primary-500 dark:focus:border-primary-400',
            'transition-colors duration-200',
            'min-h-[44px]',
            errors.subject && 'border-red-500 focus:ring-red-500'
          )}
          placeholder="What is this about?"
          autoComplete="off"
        />
        {errors.subject && (
          <p
            id="subject-error"
            className="text-red-600 dark:text-red-400 text-sm"
            role="alert"
          >
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message{' '}
          <span className="text-red-500" aria-label="required">
            *
          </span>
          <span className="ml-2 text-xs font-normal text-gray-500">
            ({formData.message.length}/5000 characters)
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? 'message-error' : 'message-description'
          }
          className={cn(
            'w-full resize-none rounded-lg border px-4 py-3',
            'bg-white dark:bg-gray-800',
            'border-gray-300 dark:border-gray-600',
            'text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'focus:border-primary-500 dark:focus:border-primary-400',
            'transition-colors duration-200',
            'min-h-[120px]',
            errors.message && 'border-red-500 focus:ring-red-500'
          )}
          placeholder="Tell us more about your inquiry..."
          maxLength={5000}
        />
        <p id="message-description" className="sr-only">
          Enter your message. Maximum 5000 characters.
        </p>
        {errors.message && (
          <p
            id="message-error"
            className="text-red-600 dark:text-red-400 text-sm"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full rounded-lg px-6 py-3 font-medium',
          'bg-primary-600 hover:bg-primary-700',
          'text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Sending...</span>
          </div>
        ) : (
          'Send Message'
        )}
      </motion.button>
    </motion.form>
  );
}

// ============================================================================
// MAIN PROFILE PAGE LAYOUT
// ============================================================================

/**
 * Complete profile page layout with all sections
 */
export function ProfilePageLayout({
  profile,
  className,
}: ProfilePageLayoutProps) {
  const handleContactSubmit = async (data: ContactFormData) => {
    // Handle form submission - integrate with your backend
    console.log('Contact form submitted:', data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message (you can implement a toast notification here)
    alert('Message sent successfully!');
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* Banner Section */}
      <motion.section
        className="relative h-96 overflow-hidden md:h-[500px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={profile.bannerImage}
          alt={`${profile.name} banner`}
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Banner Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col items-end space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              {/* Profile Image */}
              <motion.div
                className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-40 md:w-40"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Image
                  src={profile.profileImage}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Profile Info */}
              <div className="text-white">
                <motion.h1
                  className="mb-2 text-3xl font-bold md:text-4xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {profile.name}
                </motion.h1>
                <motion.p
                  className="mb-4 text-lg text-white/90 md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {profile.title}
                </motion.p>
                <motion.p
                  className="max-w-2xl text-white/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  {profile.description}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-12">
            {/* About Section */}
            <motion.section
              className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                About {profile.name}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {profile.about}
                </p>
              </div>

              {/* Services */}
              {profile.services && profile.services.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Services Offered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service, index) => (
                      <motion.span
                        key={index}
                        className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        {service}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>

            {/* Image Gallery */}
            {profile.images && profile.images.length > 0 && (
              <motion.section
                className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Gallery
                </h2>
                <ImageGallery images={profile.images} />
              </motion.section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8 lg:w-80">
            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {profile.stats.yearsExperience}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Years Experience
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {profile.stats.projectsCompleted}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Projects
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {profile.stats.clientsServed}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Happy Clients
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {profile.stats.rating}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ⭐ Rating
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                    <svg
                      className="h-4 w-4 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <a
                    href={`mailto:${profile.contact.email}`}
                    className="text-gray-600 transition-colors duration-200 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    {profile.contact.email}
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                    <svg
                      className="h-4 w-4 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <a
                    href={`tel:${profile.contact.phone}`}
                    className="text-gray-600 transition-colors duration-200 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    {profile.contact.phone}
                  </a>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                    <svg
                      className="h-4 w-4 text-primary-600 dark:text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    {profile.contact.address}
                  </span>
                </div>

                {profile.contact.website && (
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                      <svg
                        className="h-4 w-4 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <a
                      href={profile.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 transition-colors duration-200 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media */}
              {profile.contact.socialMedia && (
                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Follow Us
                  </h4>
                  <div className="flex space-x-3">
                    {profile.contact.socialMedia.facebook && (
                      <a
                        href={profile.contact.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}

                    {profile.contact.socialMedia.twitter && (
                      <a
                        href={profile.contact.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-400 hover:bg-blue-500 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}

                    {profile.contact.socialMedia.linkedin && (
                      <a
                        href={profile.contact.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-700 hover:bg-blue-800 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}

                    {profile.contact.socialMedia.instagram && (
                      <a
                        href={profile.contact.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r transition-colors duration-200"
                      >
                        <svg
                          className="h-4 w-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-3.323 9.281c-1.297 0-2.448-.49-3.323-1.297-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Send a Message
              </h3>
              <ContactForm onSubmit={handleContactSubmit} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ImageGallery, ContactForm };
export type {
  ProfilePageLayoutProps,
  ImageGalleryProps,
  ContactFormProps,
  ContactFormData,
};
