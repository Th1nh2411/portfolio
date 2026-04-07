import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks";
import { getProfile, getSkills, getExperience } from "../../lib/firestore";
import FadeIn from "../common/FadeIn";
import { ProfileSkeleton, Skeleton } from "../common/Skeleton";

export default function AboutSection() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const { data: profile, loading: loadingProfile } = useFetch(getProfile);
    const { data: skills, loading: loadingSkills } = useFetch(getSkills);
    const { data: experience, loading: loadingExp } = useFetch(getExperience);

    const expTypeColor = {
        fulltime:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        intern: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        freelance:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };

    return (
        <section id="about" className="py-24 border-t border-ink-100 dark:border-ink-800 snap-start">
            <div className="container-narrow">
                {/* Header */}
                <FadeIn>
                    <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">
                        Who I Am
                    </p>
                    <h2 className="section-title mb-16">{t("about.title")}</h2>
                </FadeIn>

                {/* Profile info grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mb-24">
                    {/* Bio */}
                    <FadeIn className="lg:col-span-3">
                        {loadingProfile ? (
                            <ProfileSkeleton />
                        ) : (
                            <>
                                <p className="text-lg text-ink-700 dark:text-ink-300 leading-relaxed mb-8">
                                    {lang === "vi" && profile?.bioVi
                                        ? profile.bioVi
                                        : profile?.bio}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        {
                                            label: t("about.birthday"),
                                            value: profile?.birthday,
                                        },
                                        {
                                            label: t("about.location"),
                                            value:
                                                lang === "vi" &&
                                                profile?.locationVi
                                                    ? profile.locationVi
                                                    : profile?.location,
                                        },
                                        {
                                            label: t("about.email"),
                                            value: profile?.email,
                                        },
                                        {
                                            label: t("about.phone"),
                                            value: profile?.phone,
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex gap-3"
                                        >
                                            <span className="text-xs font-mono text-accent uppercase tracking-wide pt-0.5 whitespace-nowrap">
                                                {item.label}
                                            </span>
                                            <span className="text-sm text-ink-700 dark:text-ink-300 break-all">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <a
                                        href={profile?.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline text-sm py-2.5 px-5"
                                    >
                                        GitHub ↗
                                    </a>
                                    <a
                                        href={`mailto:${profile?.email}`}
                                        className="btn-primary text-sm py-2.5 px-5"
                                    >
                                        Email Me
                                    </a>
                                </div>
                            </>
                        )}
                    </FadeIn>

                    {/* Education card */}
                    <FadeIn delay={0.15} className="lg:col-span-2">
                        <div className="card p-7 h-fit">
                            <p className="font-mono text-xs text-accent tracking-widest uppercase mb-5">
                                {t("about.education_title")}
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-5 h-5 text-accent"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-ink-900 dark:text-ink-100 text-base leading-tight">
                                        {t("about.education_school")}
                                    </h3>
                                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
                                        {t("about.education_degree")}
                                    </p>
                                    <p className="text-xs font-mono text-accent mt-2">
                                        {t("about.education_period")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Skills */}
                <FadeIn>
                    <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">
                        {t("about.skills_title")}
                    </p>
                    <h3 className="text-3xl font-display font-semibold text-ink-900 dark:text-ink-100 mb-10">
                        Technologies I work with
                    </h3>
                </FadeIn>

                {loadingSkills ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-24">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-40" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-24">
                        {skills?.map((skill, i) => (
                            <motion.div
                                key={skill.category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07, duration: 0.5 }}
                                className="card p-5"
                            >
                                <p className="text-xs font-mono text-accent uppercase tracking-wide mb-4">
                                    {lang === "vi" && skill.categoryVi
                                        ? skill.categoryVi
                                        : skill.category}
                                </p>
                                <ul className="space-y-2">
                                    {skill.items.map((item) => (
                                        <li
                                            key={item}
                                            className="text-sm text-ink-700 dark:text-ink-300 flex items-center gap-2"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Experience */}
                <FadeIn>
                    <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">
                        {t("about.experience_title")}
                    </p>
                    <h3 className="text-3xl font-display font-semibold text-ink-900 dark:text-ink-100 mb-10">
                        Where I've Worked
                    </h3>
                </FadeIn>

                {loadingExp ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-40" />
                        ))}
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-2 bottom-2 w-px bg-ink-100 dark:bg-ink-800 hidden md:block" />

                        <div className="space-y-6">
                            {experience?.map((exp, i) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: i * 0.1,
                                        duration: 0.5,
                                    }}
                                    className="md:pl-14 relative"
                                >
                                    {/* Timeline dot */}
                                    <div className="hidden md:flex absolute left-0 top-5 w-9 h-9 rounded-full bg-surface-light dark:bg-surface-dark border-2 border-accent items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                                    </div>

                                    <div className="card p-7">
                                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                            <div>
                                                <h4 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-100">
                                                    {lang === "vi" && exp.roleVi
                                                        ? exp.roleVi
                                                        : exp.role}
                                                </h4>
                                                <p className="text-ink-500 dark:text-ink-400 mt-0.5">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${
                                                        expTypeColor[exp.type as keyof typeof expTypeColor]
                                                    }`}
                                                >
                                                    {exp.type}
                                                </span>
                                                <span className="text-xs font-mono text-ink-400 dark:text-ink-500">
                                                    {exp.period}
                                                </span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 mt-4 mt-2">
                                            {(lang === "vi" && exp.descriptionsVi ? exp.descriptionsVi : exp.descriptions).map((desc, idx) => (
                                                <li key={idx} className="text-sm text-ink-600 dark:text-ink-400 flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />
                                                    <span>{desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
