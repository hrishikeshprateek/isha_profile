import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
    return (
        <section className="py-20 bg-[#FAF0E6] relative overflow-hidden">
            {/* Curved top divider */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-[#F2E4D8]" style={{
                clipPath: 'ellipse(80% 100% at 50% 0%)'
            }} />

            <div className="container mx-auto px-6 relative z-10 pt-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] mb-4 tracking-tight">
                            Let&apos;s Connect
                        </h2>
                        <p className="text-lg text-[#6E5045] max-w-2xl mx-auto">
                            Ready to bring your vision to life? Let&apos;s create something beautiful together
                        </p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-3xl p-8 md:p-12 shadow-xl shadow-[#F2A7A7]/10">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-[#3B241A] mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-full border border-[#F2A7A7]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#F2A7A7]/50 focus:border-transparent transition-all"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#3B241A] mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-full border border-[#F2A7A7]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#F2A7A7]/50 focus:border-transparent transition-all"
                                    placeholder="jane@example.com"
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-medium text-[#3B241A] mb-2">
                                Message
                            </label>
                            <textarea
                                rows={5}
                                className="w-full px-4 py-3 rounded-3xl border border-[#F2A7A7]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#F2A7A7]/50 focus:border-transparent transition-all resize-none"
                                placeholder="Tell me about your project..."
                            />
                        </div>

                        <div className="text-center">
                            <Button variant="hero" size="lg" className="px-12">
                                Send Message
                            </Button>
                        </div>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#F2A7A7]/20">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#F2A7A7] to-[#E8A0A0] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-[#3B241A] mb-2">Email</h3>
                            <p className="text-[#6E5045] text-sm">hello@isharani.com</p>
                        </div>

                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#F2A7A7]/20">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#DC7C7C] to-[#F2A7A7] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-[#3B241A] mb-2">Phone</h3>
                            <p className="text-[#6E5045] text-sm">+1 (555) 123-4567</p>
                        </div>

                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-[#F2A7A7]/20">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#E8A0A0] to-[#DC7C7C] rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-[#3B241A] mb-2">Location</h3>
                            <p className="text-[#6E5045] text-sm">San Francisco, CA</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-10 w-20 h-20 bg-[#F2A7A7]/5 rounded-full blur-xl" />
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-[#E8A0A0]/5 rounded-full blur-xl" />
        </section>
    );
};

export default ContactSection;

