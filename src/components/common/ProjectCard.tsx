import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Project } from "../../types";

interface ProjectCardProps {
    project: Project;
    index?: number;
    onOpen?: (project: Project) => void;
}

export default function ProjectCard({ project, index = 0, onOpen }: ProjectCardProps) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const title =
        lang === "vi" && project.titleVi ? project.titleVi : project.title;
    const description =
        lang === "vi" && project.descriptionVi
            ? project.descriptionVi
            : project.description;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div 
              onClick={() => onOpen?.(project)}
              className="card group hover:shadow-xl hover:shadow-ink-900/5 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
            >
                {/* Image */}
                <div className="relative overflow-hidden h-52">
                    <img
                        src={project.images[0]}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {project.featured && (
                        <span className="absolute top-3 left-3 text-xs font-mono font-semibold px-2.5 py-1 bg-accent text-white rounded-full">
                            Featured
                        </span>
                    )}
                    <span className="absolute bottom-3 right-3 text-xs font-mono text-white/80">
                        {project.period}
                    </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50 mb-2 leading-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed flex-1 line-clamp-3">
                        {description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                        {project.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="tag">
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 4 && (
                            <span className="tag">
                                +{project.techStack.length - 4}
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-ink-100 dark:border-ink-800">
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen?.(project);
                            }}
                            className="text-sm font-semibold text-accent hover:underline underline-offset-2 transition-colors"
                        >
                            {t("projects.view_details")} →
                        </button>
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="ml-auto text-sm text-ink-500 dark:text-ink-400 hover:text-accent transition-colors"
                            >
                                ↗ {t("projects.view_live")}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
