const AboutSection = () => {
    return (
        <section id="about" className="py-20 bg-[#F2E4D8]">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8 font-serif">
                    About me
                </h2>
                <div className="max-w-3xl mx-auto">
                    <div className="bg-[#FAFAFA] rounded-2xl p-8 shadow-lg shadow-primary/10">
                        <p className="text-lg text-[#6E5045] leading-relaxed text-center">
                            <span className="text-gradient font-semibold">Welcome to my portfolio!</span>{" "}
                            I&apos;m Sara Howari, a passionate UI/UX designer dedicated to crafting beautiful and
                            intuitive digital experiences. With a keen eye for detail and a deep understanding of
                            user-centered design principles, I transform complex ideas into elegant, user-friendly
                            interfaces that delight and engage users.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;

