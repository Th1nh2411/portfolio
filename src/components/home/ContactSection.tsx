import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUpRight,
    CircleCheck,
    CircleX,
    LoaderCircle,
    Mail,
    MapPin,
    Phone,
    Plug,
    Quote,
    Send,
    Terminal,
} from "lucide-react";
import { submitContact } from "../../lib/firestore";
import FadeIn from "../common/FadeIn";
import CopyButton from "../common/CopyButton";
import PcbBackdrop from "../pixel/PcbBackdrop";
import { GithubIcon } from "../common/BrandIcon";
import Board from "../common/Board";
import { emit, unlock } from "../../game/store";

interface FormState {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const EMPTY: FormState = { name: "", email: "", subject: "", message: "" };
const MAX = 2000;

export default function ContactSection() {
    const { t, i18n } = useTranslation();
    const vi = i18n.language === "vi";
    const [form, setForm] = useState<FormState>(EMPTY);
    const [status, setStatus] = useState<
        "idle" | "sending" | "success" | "error"
    >("idle");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (status === "success" || status === "error") setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            await submitContact(form);
            setStatus("success");
            setForm(EMPTY);
            emit("px:quest");
            window.setTimeout(() => unlock("messenger"), 1800);
        } catch {
            setStatus("error");
        }
    };

    const contactLinks = [
        {
            icon: <Mail size={17} aria-hidden />,
            label: "Email",
            value: "ducthnh2411@gmail.com",
            href: "mailto:ducthnh2411@gmail.com",
            copy: "ducthnh2411@gmail.com",
        },
        {
            icon: <Phone size={17} aria-hidden />,
            label: vi ? "Điện thoại" : "Phone",
            value: "0935 098 021",
            href: "tel:0935098021",
            copy: "0935098021",
        },
        {
            icon: <GithubIcon size={16} />,
            label: "GitHub",
            value: "Th1nh2411",
            href: "https://github.com/Th1nh2411",
            copy: "https://github.com/Th1nh2411",
        },
        {
            icon: <MapPin size={17} aria-hidden />,
            label: vi ? "Địa điểm" : "Location",
            value: vi
                ? "Quận 7, TP. Hồ Chí Minh"
                : "District 7, Ho Chi Minh City",
            href: null,
            copy: "District 7, Ho Chi Minh City",
        },
    ];

    const fields: {
        name: keyof FormState;
        label: string;
        type?: string;
        placeholder: string;
        full?: boolean;
    }[] = [
        {
            name: "name",
            label: t("contact.name"),
            placeholder: vi ? "Nguyễn Văn A" : "Jane Doe",
        },
        {
            name: "email",
            label: t("contact.email"),
            type: "email",
            placeholder: "you@company.com",
        },
        {
            name: "subject",
            label: t("contact.subject"),
            placeholder: vi ? "Hợp tác dự án…" : "Project collaboration…",
            full: true,
        },
    ];

    return (
        <section
            id="contact"
            data-circuit
            className="py-24 section-edge section-band pcb-host isolate"
        >
            <PcbBackdrop seed="contact" label="J1·CONTACT" />
            <div className="container-narrow">
                <FadeIn>
                    <p
                        data-lamp
                        className="font-pixel-mono text-xl text-accent tracking-widest uppercase mb-2"
                    >
                        &gt;{" "}
                        {vi ? "Nhiệm vụ mới: chào hỏi" : "New quest: say hello"}
                    </p>
                    <h2 className="font-heading font-semibold tracking-tight text-4xl md:text-5xl leading-[1.05] text-ink-950 dark:text-ink-50 mb-4">
                        {t("contact.title")}
                    </h2>
                    <p className="section-subtitle mb-12 max-w-lg">
                        {t("contact.subtitle")}
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
                    {/* ---------- Left: availability, channels, quote ---------- */}
                    <FadeIn
                        className="lg:col-span-2 flex flex-col gap-6"
                        delay={0.1}
                    >
                        <Board tone="sea" silk="J1 · PORTS">
                            <p className="frame-title">
                                <Plug size={14} aria-hidden /> I/O PORTS
                                <span className="frame-dots" aria-hidden>
                                    <i />
                                    <i />
                                    <i />
                                </span>
                            </p>
                            <div className="p-5">
                                <ul className="space-y-2">
                                    {contactLinks.map((link, i) => (
                                        <motion.li
                                            key={link.label}
                                            initial={{ opacity: 0, y: 8 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.06 }}
                                            className="ct-row group"
                                        >
                                            <span className="ct-row-icon">
                                                {link.icon}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-pixel-mono text-[15px] leading-none uppercase tracking-widest text-ink-400 dark:text-ink-500">
                                                    P{i + 1} · {link.label}
                                                </p>
                                                {link.href ? (
                                                    <a
                                                        href={link.href}
                                                        target={
                                                            link.href.startsWith(
                                                                "http",
                                                            )
                                                                ? "_blank"
                                                                : undefined
                                                        }
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[15px] font-medium text-ink-900 dark:text-ink-100 hover:text-accent transition-colors truncate"
                                                    >
                                                        {link.value}
                                                        <ArrowUpRight
                                                            size={14}
                                                            aria-hidden
                                                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition"
                                                        />
                                                    </a>
                                                ) : (
                                                    <p className="text-[15px] font-medium text-ink-900 dark:text-ink-100 truncate">
                                                        {link.value}
                                                    </p>
                                                )}
                                            </div>
                                            <CopyButton
                                                value={link.copy}
                                                label={link.label}
                                            />
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </Board>

                        {/* Quote */}
                        <Board silk="MSG-00" className="flex-1">
                            <figure className="ct-quote">
                                <p className="ct-prompt" aria-hidden>
                                    <Terminal size={13} /> ~/thinh $ cat
                                    motto.txt
                                </p>
                                <Quote
                                    size={24}
                                    aria-hidden
                                    className="ct-quote-mark"
                                />
                                <blockquote className="font-heading text-lg md:text-xl leading-snug tracking-tight text-ink-900 dark:text-ink-50">
                                    {vi
                                        ? "Mình luôn sẵn sàng trao đổi về dự án mới, ý tưởng sáng tạo, hay cơ hội trở thành một phần của điều gì đó tuyệt vời."
                                        : "I'm always open to discussing new projects, creative ideas, or opportunities to be part of something great."}
                                </blockquote>
                                <figcaption className="mt-5 flex items-center gap-3">
                                    <span className="ct-avatar" aria-hidden>
                                        T
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-ink-900 dark:text-ink-50">
                                            Nguyen Duc Thinh
                                        </span>
                                        <span className="block text-xs text-ink-500 dark:text-ink-400">
                                            Full-Stack Web Developer
                                        </span>
                                    </span>
                                </figcaption>
                            </figure>
                        </Board>
                    </FadeIn>

                    {/* ---------- Right: form ---------- */}
                    <FadeIn className="lg:col-span-3" delay={0.15}>
                        <Board
                            tone="peach"
                            pins
                            silk="TX-01 · REV A"
                            className="h-full"
                        >
                            <p className="frame-title">
                                <Send size={14} aria-hidden /> TRANSMITTER
                                <span className="frame-dots" aria-hidden>
                                    <i />
                                    <i />
                                    <i />
                                </span>
                            </p>
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 md:p-7 flex flex-col"
                            >
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="font-heading text-xl font-semibold tracking-tight text-ink-950 dark:text-ink-50">
                                            {vi ? "Gửi" : "Send"}
                                        </h3>
                                        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                                            {vi
                                                ? "Kể mình nghe về dự án hoặc vị trí bạn đang tìm."
                                                : "Tell me about your project or the role you're hiring for."}
                                        </p>
                                    </div>
                                    <span
                                        className={`ct-pill shrink-0 ${status === "success" ? "ct-pill-live" : ""}`}
                                        aria-live="polite"
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <LoaderCircle
                                                    size={12}
                                                    className="animate-spin"
                                                    aria-hidden
                                                />
                                                {vi ? "Đang gửi" : "Sending"}
                                            </>
                                        ) : status === "success" ? (
                                            <>
                                                <CircleCheck
                                                    size={12}
                                                    aria-hidden
                                                />
                                                {vi ? "Đã gửi" : "Sent"}
                                            </>
                                        ) : status === "error" ? (
                                            <>
                                                <CircleX
                                                    size={12}
                                                    aria-hidden
                                                    className="text-red-500"
                                                />
                                                {vi ? "Lỗi" : "Error"}
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    className="ct-ready-dot"
                                                    aria-hidden
                                                />
                                                {vi ? "Sẵn sàng" : "Ready"}
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {fields.map((f, fi) => (
                                        <label
                                            key={f.name}
                                            className={`block ${f.full ? "sm:col-span-2" : ""}`}
                                        >
                                            <span className="ct-label">
                                                <b className="ct-pin">
                                                    0{fi + 1}
                                                </b>
                                                {f.label}
                                            </span>
                                            <input
                                                type={f.type ?? "text"}
                                                name={f.name}
                                                value={form[f.name]}
                                                onChange={handleChange}
                                                required
                                                className="field"
                                                placeholder={f.placeholder}
                                            />
                                        </label>
                                    ))}
                                    <label className="block sm:col-span-2">
                                        <span className="ct-label">
                                            <b className="ct-pin">04</b>
                                            {t("contact.message")}
                                            <em className="ml-auto not-italic tabular-nums text-ink-400">
                                                {form.message.length}/{MAX}
                                            </em>
                                        </span>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            maxLength={MAX}
                                            className="field resize-none"
                                            placeholder={
                                                vi
                                                    ? "Xin chào Thịnh, mình muốn…"
                                                    : "Hi Thinh, I'd like to…"
                                            }
                                        />
                                    </label>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="btn-pixel disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {status === "sending" ? (
                                            <>
                                                <LoaderCircle
                                                    size={15}
                                                    aria-hidden
                                                    className="animate-spin"
                                                />
                                                {t("contact.sending")}
                                            </>
                                        ) : (
                                            <>
                                                {t("contact.send")}{" "}
                                                <Send size={15} aria-hidden />
                                            </>
                                        )}
                                    </button>
                                    <AnimatePresence mode="wait">
                                        {status === "success" && (
                                            <motion.p
                                                key="ok"
                                                initial={{ opacity: 0, x: 8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-1.5 text-sm text-sea-dark dark:text-sea"
                                            >
                                                <CircleCheck
                                                    size={16}
                                                    aria-hidden
                                                />
                                                {t("contact.success")}
                                            </motion.p>
                                        )}
                                        {status === "error" && (
                                            <motion.p
                                                key="err"
                                                initial={{ opacity: 0, x: 8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-1.5 text-sm text-red-500"
                                            >
                                                <CircleX
                                                    size={16}
                                                    aria-hidden
                                                />
                                                {t("contact.error")}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                    <p className="ml-auto text-xs text-ink-400 dark:text-ink-500">
                                        {vi
                                            ? "Hoặc email trực tiếp:"
                                            : "Or email directly:"}{" "}
                                        <a
                                            href="mailto:ducthnh2411@gmail.com"
                                            className="text-accent hover:underline"
                                        >
                                            ducthnh2411@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </Board>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
