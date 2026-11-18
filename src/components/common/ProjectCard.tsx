import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Project } from "../../types";
import PixelImage from "../pixel/PixelImage";
import TechIcon from "../../game/TechIcon";
import Board from "./Board";

interface ProjectCardProps {
    project: Project;
    index?: number;
    onOpen?: (project: Project) => void;
}

/**
 * Project "module": straight 2px frame with a hard shadow, an accent strip that
 * lights when the section is powered, a 16:10 screenshot with silkscreen-style
 * overlays, and a compact body (period, title, 2-line summary, top tech).
 */
export default function ProjectCard({ project, index = 0, onOpen }: ProjectCardProps) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const [playKey, setPlayKey] = useState(0);

    const title = lang === "vi" && project.titleVi ? project.titleVi : project.title;
    const description =
        lang === "vi" && project.descriptionVi ? project.descriptionVi : project.description;
    const live = /present|nay|hiện/i.test(project.period);
    const shown = project.techStack.slice(0, 3);
    const more = project.techStack.length - shown.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
        >
            <Board
                tone="peach"
                pins
                silk={`P-${String(index + 1).padStart(2, "0")} · REV A`}
                onClick={() => onOpen?.(project)}
                onMouseEnter={() => setPlayKey((k) => k + 1)}
                className="board-hover group flex flex-col h-[calc(100%-8px)] cursor-pointer"
            >
                {/* Screenshot */}
                <div className="proj-media">
                    <PixelImage src={project.images[0]} alt={title} playKey={playKey} className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent pointer-events-none" />
                    {project.featured && (
                        <span className="proj-silk absolute top-3 left-5 !bg-accent !text-ink-950 !border-ink-950" title="Featured">
                            ★ FEATURED
                        </span>
                    )}
                    <span className="proj-status !right-5">
                        <span className={`led ${live ? "led-green" : "led-amber"}`} />
                        {live ? "LIVE" : "DONE"}
                    </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5 pb-4">
                    <p className="font-pixel-mono text-base leading-none text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-2">
                        {project.period}
                    </p>
                    <h3 className="font-pixel text-2xl leading-tight text-ink-950 dark:text-ink-50 mb-2">{title}</h3>
                    <p className="text-sm leading-relaxed text-ink-500 dark:text-ink-400 line-clamp-2 mb-4">{description}</p>

                    <ul className="flex flex-wrap gap-1.5 mt-auto" aria-label="Tech stack">
                        {shown.map((tech) => (
                            <li key={tech} className="tag-pixel">
                                <TechIcon name={tech} scale={1} />
                                {tech}
                            </li>
                        ))}
                        {more > 0 && <li className="tag-pixel">+{more}</li>}
                    </ul>
                </div>

                {/* Footer */}
                <div className="proj-foot">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen?.(project);
                        }}
                        className="inline-flex items-center gap-2 text-ink-900 dark:text-ink-50 group-hover:text-accent transition-colors"
                    >
                        {t("projects.view_details")}
                        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </button>
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="ml-auto text-ink-500 dark:text-ink-400 hover:text-accent transition-colors"
                        >
                            {t("projects.view_live")} ↗
                        </a>
                    )}
                </div>
            </Board>
        </motion.div>
    );
}
