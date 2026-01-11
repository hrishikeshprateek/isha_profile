import Image from "next/image";

const AboutSection = () => {
    const stats = [
        { number: "50+", label: "Projects Completed" },
        { number: "30+", label: "Happy Clients" },
        { number: "5+", label: "Years Experience" },
        { number: "15+", label: "Awards Won" }
    ];

    return (
        <section id="about" className="py-20 bg-[#F2E4D8] relative overflow-hidden">
            {/* Curved bottom divider */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#FAF0E6]" style={{
                clipPath: 'ellipse(80% 100% at 50% 100%)'
            }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] mb-4 tracking-tight">
                        About Me
                    </h2>
                    <p className="text-lg text-[#6E5045] max-w-2xl mx-auto">
                        Creating meaningful experiences through thoughtful design
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        {/* Image Section */}
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#F2A7A7]/20 border-4 border-white">
                                <div className="aspect-[3/4] bg-gradient-to-br from-[#F2A7A7]/20 to-[#E8A0A0]/20 relative">
                                    <Image
                                        src="/isha_a.png"
                                        alt="Isha Rani"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            {/* Decorative floating shape */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F2A7A7]/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#E8A0A0]/20 rounded-full blur-2xl" />
                        </div>

                        {/* Content Section */}
                        <div>
                            <div className="bg-[#FAFAFA] rounded-3xl p-8 md:p-10 shadow-lg shadow-[#F2A7A7]/10">
                                <p className="text-lg text-[#6E5045] leading-relaxed mb-6">
                                    <span className="text-gradient font-semibold text-xl">Welcome to my portfolio!</span>
                                    <br /><br />
                                    I&apos;m Isha Rani, a passionate UI/UX designer dedicated to crafting beautiful and
                                    intuitive digital experiences. With a keen eye for detail and a deep understanding of
                                    user-centered design principles, I transform complex ideas into elegant, user-friendly
                                    interfaces that delight and engage users.
                                </p>
                                <p className="text-[#6E5045] leading-relaxed">
                                    My approach combines creativity with strategy, ensuring that every design decision serves
                                    both aesthetic and functional purposes. I believe in creating experiences that not only
                                    look beautiful but also solve real problems and drive meaningful results.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 text-center shadow-lg shadow-[#F2A7A7]/10 hover:shadow-xl hover:shadow-[#DC7C7C]/20 transition-all duration-300 border border-[#F2A7A7]/10"
                            >
                                <div className="text-3xl md:text-4xl font-serif font-bold text-gradient mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-[#6E5045] font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative floating dots */}
            <div className="absolute top-40 right-20 w-3 h-3 bg-[#F2A7A7]/40 rounded-full animate-pulse" />
            <div className="absolute bottom-40 left-20 w-4 h-4 bg-[#E8A0A0]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </section>
    );
};

export default AboutSection;

