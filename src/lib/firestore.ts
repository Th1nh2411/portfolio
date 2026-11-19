import type { Project, Profile, Experience, Skill, ContactMessage } from "../types";
import { profileData, projectsData, experienceData, skillsData } from "../data/fallback";

/**
 * Data layer.
 * - The Firebase SDK is loaded lazily (dynamic import), so it is not part of the
 *   first JS bundle and the page paints sooner.
 * - Each getter is de-duplicated (one in-flight request per key, shared by every
 *   section that asks) and the last good result is cached in localStorage, so a
 *   repeat visit renders real content instantly (stale-while-revalidate, see useFetch).
 */

const CACHE_PREFIX = "px.data.v1.";

export function readCache<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

function writeCache(key: string, value: unknown) {
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
    } catch {
        /* quota / private mode: just skip caching */
    }
}

let fs: Promise<{ db: import("firebase/firestore").Firestore; mod: typeof import("firebase/firestore") }> | null = null;
function firestore() {
    fs ??= Promise.all([import("./firebase"), import("firebase/firestore")]).then(([f, mod]) => ({ db: f.db, mod }));
    return fs;
}

const inflight = new Map<string, Promise<unknown>>();

/** Fetch once per page load; on success cache it, on failure fall back to the cache, then bundled data. */
function cached<T>(key: string, fetcher: () => Promise<T>, fallback: T): Promise<T> {
    let p = inflight.get(key) as Promise<T> | undefined;
    if (!p) {
        p = fetcher()
            .then((v) => {
                writeCache(key, v);
                return v;
            })
            .catch((err) => {
                console.warn(`Firestore fetch failed (${key}), using cached/fallback data`, err);
                return readCache<T>(key) ?? fallback;
            });
        inflight.set(key, p);
    }
    return p;
}

export function getProfile(): Promise<Profile> {
    return cached("profile", async () => {
        const { db, mod } = await firestore();
        const snap = await mod.getDoc(mod.doc(db, "portfolio", "profile"));
        return snap.exists() ? (snap.data() as Profile) : profileData;
    }, profileData);
}

export function getProjects(): Promise<Project[]> {
    return cached("projects", async () => {
        const { db, mod } = await firestore();
        const snap = await mod.getDocs(mod.query(mod.collection(db, "projects"), mod.orderBy("period", "desc")));
        if (snap.empty) return projectsData;
        return snap.docs.map((d) => withViFallback({ id: d.id, ...d.data() } as Project));
    }, projectsData);
}

export function getExperience(): Promise<Experience[]> {
    return cached("experience", async () => {
        const { db, mod } = await firestore();
        const snap = await mod.getDocs(mod.collection(db, "experience"));
        return snap.empty ? experienceData : snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience));
    }, experienceData);
}

export function getSkills(): Promise<Skill[]> {
    return cached("skills", async () => {
        const { db, mod } = await firestore();
        const snap = await mod.getDocs(mod.collection(db, "skills"));
        return snap.empty ? skillsData : snap.docs.map((d) => d.data() as Skill);
    }, skillsData);
}

/** Firestore docs may lack Vietnamese fields: borrow them from the bundled data. */
const VI_KEYS = ["titleVi", "descriptionVi", "detailDescriptionsVi", "detailsVi", "responsibilitiesVi"] as const;
function withViFallback(p: Project): Project {
    const local = projectsData.find((x) => x.id === p.id);
    if (!local) return p;
    const out = { ...p } as Record<string, unknown>;
    for (const k of VI_KEYS) if (out[k] == null && local[k] != null) out[k] = local[k];
    return out as unknown as Project;
}

/** Cache key for each getter, so useFetch can read the cache synchronously. */
export const CACHE_KEYS = new Map<() => Promise<unknown>, string>([
    [getProfile, "profile"],
    [getProjects, "projects"],
    [getExperience, "experience"],
    [getSkills, "skills"],
]);

/** Kick off every request in parallel as early as possible (called from main.tsx). */
export function prefetchAll() {
    void getProfile();
    void getProjects();
    void getExperience();
    void getSkills();
}

export async function submitContact(msg: Omit<ContactMessage, "createdAt">): Promise<void> {
    const { db, mod } = await firestore();
    await mod.addDoc(mod.collection(db, "contacts"), { ...msg, createdAt: mod.Timestamp.now() });
}
