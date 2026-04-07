import {
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    Timestamp,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type {
    Project,
    Profile,
    Experience,
    Skill,
    ContactMessage,
} from "../types";
import {
    profileData,
    projectsData,
    experienceData,
    skillsData,
} from "../data/fallback";

async function safeFetch<T>(
    fetcher: () => Promise<T>,
    fallback: T
): Promise<T> {
    try {
        return await fetcher();
    } catch (err) {
        console.warn("Firestore fetch failed, using fallback data", err);
        return fallback;
    }
}

export async function getProfile(): Promise<Profile> {
    return safeFetch(async () => {
        const docRef = doc(db, "portfolio", "profile");
        const snap = await getDoc(docRef);
        if (snap.exists()) return snap.data() as Profile;
        return profileData;
    }, profileData);
}

export async function getProjects(): Promise<Project[]> {
    return safeFetch(async () => {
        const q = query(collection(db, "projects"), orderBy("period", "desc"));
        const snap = await getDocs(q);
        if (snap.empty) return projectsData;
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    }, projectsData);
}

export async function getProjectById(id: string): Promise<Project | null> {
    return safeFetch(async () => {
        const docRef = doc(db, "projects", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() } as Project;
        return projectsData.find((p) => p.id === id) ?? null;
    }, projectsData.find((p) => p.id === id) ?? null);
}

export async function getExperience(): Promise<Experience[]> {
    return safeFetch(async () => {
        const snap = await getDocs(collection(db, "experience"));
        if (snap.empty) return experienceData;
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience));
    }, experienceData);
}

export async function getSkills(): Promise<Skill[]> {
    return safeFetch(async () => {
        const snap = await getDocs(collection(db, "skills"));
        if (snap.empty) return skillsData;
        return snap.docs.map((d) => d.data() as Skill);
    }, skillsData);
}

export async function submitContact(
    msg: Omit<ContactMessage, "createdAt">
): Promise<void> {
    await addDoc(collection(db, "contacts"), {
        ...msg,
        createdAt: Timestamp.now(),
    });
}
