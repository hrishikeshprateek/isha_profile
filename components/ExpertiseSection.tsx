const ExpertiseSection = () => {
    const skills = [
        { name: "UI/UX Design", level: 95 },
        { name: "Figma & Adobe XD", level: 90 },
        { name: "Web Design", level: 88 },
        { name: "Prototyping", level: 92 },
        { name: "User Research", level: 85 },
        { name: "Brand Identity", level: 87 }
    ];

    return (
        <section className="py-20 bg-[#F2E4D8] relative">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3B241A] mb-4 tracking-tight">
                            Expertise
                        </h2>
                        <p className="text-lg text-[#6E5045] max-w-2xl mx-auto">
                            Years of dedication refined into mastery
                        </p>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-3xl p-8 md:p-12 shadow-xl shadow-[#F2A7A7]/10">
                        <div className="space-y-8">
                            {skills.map((skill, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-medium text-[#3B241A] text-lg">
                                            {skill.name}
                                        </span>
                                        <span className="text-[#F2A7A7] font-semibold">
                                            {skill.level}%
                                        </span>
                                    </div>
                                    <div className="h-3 bg-[#F2E4D8] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#F2A7A7] via-[#DC7C7C] to-[#E8A0A0] rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative floating shapes */}
            <div className="absolute top-20 left-10 w-16 h-16 border-2 border-[#F2A7A7]/20 rounded-full" />
            <div className="absolute bottom-20 right-10 w-12 h-12 bg-[#E8A0A0]/10 rounded-lg rotate-45" />
        </section>
    );
};

export default ExpertiseSection;

