const ServicesSection = () => {
    const services = [
        {
            title: "UI/UX Design",
            description: "Creating beautiful and intuitive user interfaces that delight users and drive engagement.",
            icon: "🎨"
        },
        {
            title: "Web Design",
            description: "Designing responsive websites that look stunning on all devices and screens.",
            icon: "💻"
        },
        {
            title: "Brand Identity",
            description: "Crafting unique brand identities that tell your story and connect with your audience.",
            icon: "✨"
        },
        {
            title: "Consultation",
            description: "Providing expert guidance on design strategy and digital transformation.",
            icon: "💡"
        }
    ];

    return (
        <section className="py-20 bg-[#FAF0E6] relative overflow-hidden">
            {/* Curved top divider */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-[#F2E4D8]" style={{
                clipPath: 'ellipse(80% 100% at 50% 0%)'
            }} />

            <div className="container mx-auto px-6 relative z-10 pt-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] mb-4 tracking-tight">
                        Services
                    </h2>
                    <p className="text-lg text-[#6E5045] max-w-2xl mx-auto">
                        Crafting exceptional digital experiences with elegance and purpose
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-[#FAFAFA] rounded-3xl p-8 shadow-lg shadow-[#F2A7A7]/10 hover:shadow-xl hover:shadow-[#DC7C7C]/20 transition-all duration-300 hover:-translate-y-2 border border-[#F2A7A7]/10"
                        >
                            <div className="text-5xl mb-4">{service.icon}</div>
                            <h3 className="text-xl font-serif font-semibold text-[#3B241A] mb-3">
                                {service.title}
                            </h3>
                            <p className="text-[#6E5045] leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating decorative dots */}
            <div className="absolute top-40 right-20 w-3 h-3 bg-[#F2A7A7]/40 rounded-full" />
            <div className="absolute bottom-40 left-20 w-4 h-4 bg-[#E8A0A0]/30 rounded-full" />
            <div className="absolute top-1/2 right-40 w-2 h-2 bg-[#DC7C7C]/40 rounded-full" />
        </section>
    );
};

export default ServicesSection;

