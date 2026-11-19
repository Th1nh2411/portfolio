import { useTranslation } from "react-i18next";
import { Check, Download, GraduationCap, Play } from 'lucide-react'
import { GithubIcon } from "../common/BrandIcon";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks";
import { getProfile, getExperience } from "../../lib/firestore";
import FadeIn from "../common/FadeIn";
import { ProfileSkeleton, Skeleton } from "../common/Skeleton";
import { unlock } from "../../game/store";
import CopyButton from "../common/CopyButton";
import Board from "../common/Board";
import Sprite from "../../game/Sprite";
import { COIN } from "../../game/art";
import PcbBackdrop from "../pixel/PcbBackdrop";
import { useCvUrl } from "../../lib/cv";

export default function AboutSection() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const { data: profile, loading: loadingProfile } = useFetch(getProfile);
    const { data: experience, loading: loadingExp } = useFetch(getExperience);
    const cvUrl = useCvUrl(profile?.cvUrl);


    return (
        <section id="about" data-circuit className="py-24 section-edge pcb-host isolate overflow-x-clip">
            <PcbBackdrop seed="about" label="U1·ABOUT" />
            <div className="container-narrow">
                <div>
                {/* Header */}
                <FadeIn>
                    <p data-lamp className="font-pixel-mono text-xl text-accent tracking-widest uppercase mb-2">
                        &gt; Who I Am
                    </p>
                    <h2 className="section-title mb-8">{t("about.title")}</h2>
                </FadeIn>

                {/* Profile info grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 mb-16">
                    {/* Bio */}
                    <FadeIn className="lg:col-span-3">
                        {loadingProfile ? (
                            <ProfileSkeleton />
                        ) : (
                            <>
                                <p className="text-lg text-ink-700 dark:text-ink-300 leading-relaxed mb-6">
                                    {lang === "vi" && profile?.bioVi
                                        ? profile.bioVi
                                        : profile?.bio}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        {
                                            label: t("about.birthday"),
                                            value: profile?.birthday,
                                            copy: false,
                                        },
                                        {
                                            copy: true,
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
                                            copy: true,
                                        },
                                        {
                                            label: t("about.phone"),
                                            value: profile?.phone,
                                            copy: true,
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="font-pixel-mono text-lg leading-none text-accent uppercase tracking-wide pt-0.5 whitespace-nowrap">
                                                {item.label}
                                            </span>
                                            <span className="text-sm text-ink-700 dark:text-ink-300 break-all">
                                                {item.value}
                                            </span>
                                            {item.copy && item.value && (
                                                <CopyButton value={item.value} label={item.label} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <a
                                        href={profile?.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline"
                                    >
                                        <GithubIcon size={16} /> GitHub
                                    </a>
                                    {cvUrl && (
                                        <a
                                            href={cvUrl}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                        >
                                            <Download size={16} aria-hidden /> {t("actions.download_cv")}
                                        </a>
                                    )}
                                </div>
                            </>
                        )}
                    </FadeIn>

                    {/* Education card */}
                    <FadeIn delay={0.15} className="lg:col-span-2">
                        <Board tone="sea" silk="EDU-01" className="h-fit">
                            <p className="frame-title">
                                <GraduationCap size={15} aria-hidden /> {t("about.education_title")}
                                <span className="frame-dots" aria-hidden><i /><i /><i /></span>
                            </p>
                            <div className="flex gap-4 p-6">
                                <div className="pw w-10 h-10 bg-sea/20 border-2 border-sea flex items-center justify-center flex-shrink-0">
                                    <GraduationCap size={20} aria-hidden className="text-sea-dark dark:text-sea" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-semibold text-ink-900 dark:text-ink-100 text-base leading-snug">
                                        {t("about.education_school")}
                                    </h3>
                                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
                                        {t("about.education_degree")}
                                    </p>
                                    <p className="font-pixel-mono text-lg leading-none text-accent mt-2">
                                        {t("about.education_period")}
                                    </p>
                                </div>
                            </div>
                        </Board>
                    </FadeIn>
                </div>

                </div>

                <div>
                {/* Experience: a level map, oldest stage = 1-1 */}
                <FadeIn>
                    <p className="font-pixel-mono text-xl text-accent tracking-widest uppercase mb-2">
                        &gt; {t("about.experience_title")}
                    </p>
                    <h3 className="font-heading font-semibold tracking-tight text-3xl md:text-4xl leading-[1.05] text-ink-950 dark:text-ink-50 mb-8">
                        World Map
                    </h3>
                </FadeIn>

                {loadingExp ? (
                    <div className="space-y-6 md:pl-[172px]">
                        <Skeleton className="h-[170px]" />
                        <Skeleton className="h-[200px]" />
                    </div>
                ) : (
                    <ol className="relative">
                        {experience?.map((exp, i) => {
                            const stage = (experience?.length ?? 0) - i;
                            const current = /present|nay|hiện/i.test(exp.period);
                            const last = i === (experience?.length ?? 0) - 1;
                            const [from, to] = exp.period.split(/\s*[–-]\s*/);
                            return (
                                <motion.li
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    onViewportEnter={last ? () => unlock("world_map") : undefined}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                    className={`relative grid grid-cols-1 md:grid-cols-[140px_1fr] gap-x-8 pb-6 last:pb-0 ${current ? "" : "exp-done"}`}
                                >
                                    {/* Timeline: a copper trace in the gutter, one via per stage */}
                                    {!last && <span aria-hidden className="tl-trace hidden md:block" />}
                                    <span aria-hidden className={`tl-via hidden md:block ${current ? "is-current" : ""}`} />
                                    {/* When: big period + stage silkscreen (desktop) */}
                                    <div className="hidden md:block text-right pt-5">
                                        <p className="font-pixel-mono text-2xl leading-none text-ink-900 dark:text-ink-100">{from}</p>
                                        <p className={`font-pixel-mono text-lg leading-none mt-1 ${current ? "text-accent" : "text-ink-400 dark:text-ink-500"}`}>
                                            {to}
                                        </p>
                                        <p className="font-pixel-mono text-sm leading-none text-ink-400 dark:text-ink-500 tracking-widest mt-3">
                                            WORLD 1-{stage}
                                        </p>
                                    </div>

                                    {/* Card */}
                                    <Board tone={current ? "peach" : "sea"} silk={`EXP-${String(stage).padStart(2, "0")}`} className="exp-card px-6 py-5">
                                        <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                                            <div className="flex-1 min-w-[12rem]">
                                                <p className="md:hidden font-pixel-mono text-base leading-none text-ink-400 dark:text-ink-500 mb-2">
                                                    {exp.period} · WORLD 1-{stage}
                                                </p>
                                                <h4 className="font-heading font-semibold tracking-tight text-xl leading-snug text-ink-950 dark:text-ink-50">
                                                    {lang === "vi" && exp.roleVi ? exp.roleVi : exp.role}
                                                </h4>
                                                <p className="text-ink-500 dark:text-ink-400 mt-1">{exp.company}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`exp-chip ${current ? "is-current" : ""}`}>
                                                    {current ? <><Play size={9} fill="currentColor" aria-hidden className="mr-1" />NOW PLAYING</> : <><Check size={11} strokeWidth={3} aria-hidden className="mr-1" />CLEARED</>}
                                                </span>
                                                <span className="exp-chip">{exp.type.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <ul className="mt-4 space-y-2">
                                            {(lang === "vi" && exp.descriptionsVi ? exp.descriptionsVi : exp.descriptions).map((desc, idx) => (
                                                <li key={idx} className="group/coin text-sm leading-relaxed text-ink-600 dark:text-ink-400 flex items-start gap-2.5">
                                                    <span className="coin-bullet shrink-0 flex items-center h-[1.625em]">
                                                        <Sprite
                                                            sprite={COIN}
                                                            scale={2}
                                                            animate="0.6s"
                                                            fallback={<span className="block mt-[5px] w-1.5 h-1.5 bg-accent" />}
                                                        />
                                                    </span>
                                                    <span>{desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Board>
                                </motion.li>
                            );
                        })}
                    </ol>
                )}
                </div>
            </div>
        </section>
    );
}
