import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate premium submit transitions
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormState({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-32 px-6 md:px-12 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-12 md:mb-16">
        <span className="font-sans text-xs tracking-[0.3em] text-black/40 uppercase block mb-4">
          Get In Touch
        </span>
        <h1 className="font-serif text-[60px] md:text-[80px] lg:text-[100px] font-bold tracking-tight leading-none text-black">
          CONTACT
        </h1>
      </header>

      <p className="font-sans text-base md:text-lg text-black/60 mb-12 leading-relaxed">
        Have an exciting project in mind, a freelance collaboration, or simply want to chat about creative code? Drop me a message. Let's build something unforgettable.
      </p>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-black p-8 rounded-sm bg-neutral-50/50 flex flex-col gap-4 text-center md:text-left"
        >
          <h2 className="font-serif text-3xl font-bold">Thank you, {formState.name}!</h2>
          <p className="font-sans text-black/60 text-sm md:text-base">
            Your message has been successfully broadcast. I'll get back to you within 24 hours at <strong className="text-black">{formState.email}</strong>.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
          
          {/* Name Field */}
          <div className="flex flex-col gap-2 relative group">
            <label className="font-sans text-xs font-bold tracking-widest uppercase text-black/40 group-focus-within:text-black transition-colors">
              Name
            </label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="border-b border-black/15 bg-transparent py-3 font-sans text-lg outline-none focus:border-black transition-colors"
              placeholder="Your Name"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2 relative group">
            <label className="font-sans text-xs font-bold tracking-widest uppercase text-black/40 group-focus-within:text-black transition-colors">
              Email
            </label>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="border-b border-black/15 bg-transparent py-3 font-sans text-lg outline-none focus:border-black transition-colors"
              placeholder="your@email.com"
            />
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-2 relative group">
            <label className="font-sans text-xs font-bold tracking-widest uppercase text-black/40 group-focus-within:text-black transition-colors">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              className="border-b border-black/15 bg-transparent py-3 font-sans text-lg outline-none focus:border-black resize-none transition-colors"
              placeholder="Tell me about your project or idea..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="self-start font-sans font-bold tracking-widest uppercase text-xs md:text-sm border border-black px-8 py-4 bg-white text-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer"
          >
            Send Message <span className="inline-block translate-x-1 group-hover:translate-x-2 transition-transform">→</span>
          </button>

        </form>
      )}
    </main>
  );
}
