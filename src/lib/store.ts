import { COURSE_CHALLENGES, ChallengeItem } from "./challenges-data";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  role: "student" | "teacher";
  full_name: string;
  email: string;
  username: string;
  xp: number;
  streak: number;
  is_guest: boolean;
}

export interface LiveRoomState {
  code: string;
  status: "lobby" | "live" | "paused" | "ended";
  started_at: string | null;
  duration_sec: number;
  challenge_id: string;
  teacher_id: string;
  leaderboard: Array<{
    user_id: string;
    nickname: string;
    score: number;
    passed: boolean;
    hintLevel: number;
    code_snippet?: string;
  }>;
  concept_counts: Record<string, number>;
  latest_nudge?: string | null;
}

class AppStore {
  private localKey = "ozing_yoz_data_v3";
  private channel: BroadcastChannel | null = null;
  private listeners: Set<() => void> = new Set();
  private memoryCache: any = null;

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("ozing_yoz_sync");
      this.channel.onmessage = (event) => {
        if (event.data?.type === "STORE_UPDATE") {
          this.notify();
        }
      };
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private getLocalData() {
    if (typeof localStorage !== "undefined") {
      try {
        const raw = localStorage.getItem(this.localKey);
        if (raw) return JSON.parse(raw);
      } catch {}
    } else if (this.memoryCache) {
      return this.memoryCache;
    }

    const defaultData = {
      profile: {
        id: "",
        role: "student",
        full_name: "",
        email: "",
        username: "",
        xp: 0,
        streak: 0,
        is_guest: true,
      } as UserProfile,
      customChallenges: [] as ChallengeItem[],
      completedIds: [] as string[],
      codeDrafts: {} as Record<string, { html: string; css: string; js?: string }>,
      rooms: {} as Record<string, LiveRoomState>,
    };

    if (typeof localStorage === "undefined") {
      this.memoryCache = defaultData;
    }
    return defaultData;
  }

  private saveLocalData(data: any) {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.setItem(this.localKey, JSON.stringify(data));
        this.channel?.postMessage({ type: "STORE_UPDATE" });
      } catch {}
    } else {
      this.memoryCache = data;
    }
    this.notify();
  }

  // --- Profile Management ---
  getProfile(): UserProfile {
    return this.getLocalData().profile;
  }

  setProfile(profile: Partial<UserProfile>) {
    const data = this.getLocalData();
    data.profile = { ...data.profile, ...profile };
    this.saveLocalData(data);
  }

  isTeacher(): boolean {
    return this.getProfile().role === "teacher";
  }

  logout() {
    const data = this.getLocalData();
    data.profile = {
      id: "guest-id",
      role: "student",
      full_name: "Mehmon",
      email: "",
      username: "mehmon",
      xp: 0,
      streak: 0,
      is_guest: true,
    };
    this.saveLocalData(data);
    try {
      supabase.auth.signOut();
    } catch {}
  }

  addXp(points: number) {
    const data = this.getLocalData();
    data.profile.xp = (data.profile.xp || 0) + points;
    this.saveLocalData(data);
  }

  // --- Challenges ---
  getChallenges(): ChallengeItem[] {
    const data = this.getLocalData();
    return [...COURSE_CHALLENGES, ...(data.customChallenges || [])];
  }

  getChallengeById(id: string): ChallengeItem {
    const all = this.getChallenges();
    return all.find((c) => c.id === id) || all[0];
  }

  saveCustomChallenge(ch: ChallengeItem) {
    const data = this.getLocalData();
    data.customChallenges = [ch, ...(data.customChallenges || [])];
    this.saveLocalData(data);
  }

  markChallengeCompleted(id: string) {
    const data = this.getLocalData();
    if (!data.completedIds.includes(id)) {
      data.completedIds.push(id);
      this.saveLocalData(data);
    }
  }

  isChallengeCompleted(id: string): boolean {
    return this.getLocalData().completedIds.includes(id);
  }

  // --- Code Draft Persistence ---
  saveDraft(challengeId: string, html: string, css: string, js: string = "") {
    const data = this.getLocalData();
    data.codeDrafts[challengeId] = { html, css, js };
    this.saveLocalData(data);
  }

  getDraft(challengeId: string): { html: string; css: string; js?: string } | null {
    return this.getLocalData().codeDrafts?.[challengeId] || null;
  }

  // --- Live Rooms ---
  getRoom(code: string): LiveRoomState {
    const data = this.getLocalData();
    if (data.rooms?.[code]) return data.rooms[code];

    const defaultRoom: LiveRoomState = {
      code,
      status: "lobby",
      started_at: null,
      duration_sec: 900,
      challenge_id: "22222222-2222-2222-2222-222222222222",
      teacher_id: "teacher-1",
      leaderboard: [],
      concept_counts: {},
      latest_nudge: null,
    };
    return defaultRoom;
  }

  resetAll() {
    const clean = {
      profile: {
        id: "",
        role: "student" as const,
        full_name: "",
        email: "",
        username: "",
        xp: 0,
        streak: 0,
        is_guest: true,
      },
      customChallenges: [],
      completedIds: [],
      codeDrafts: {},
      rooms: {},
    };
    this.saveLocalData(clean);
  }

  updateRoom(code: string, updates: Partial<LiveRoomState>) {
    const data = this.getLocalData();
    const current = this.getRoom(code);
    data.rooms[code] = { ...current, ...updates };
    this.saveLocalData(data);
  }

  submitStudentSolution(code: string, userId: string, nickname: string, score: number, hintLevel: number, codeSnippet: string) {
    const current = this.getRoom(code);
    const existingIdx = current.leaderboard.findIndex((e) => e.user_id === userId || e.nickname === nickname);

    let updatedBoard = [...current.leaderboard];
    if (existingIdx >= 0) {
      updatedBoard[existingIdx] = {
        ...updatedBoard[existingIdx],
        score,
        passed: true,
        hintLevel,
        code_snippet: codeSnippet,
      };
    } else {
      updatedBoard.push({
        user_id: userId,
        nickname,
        score,
        passed: true,
        hintLevel,
        code_snippet: codeSnippet,
      });
    }

    // Sort descending by score
    updatedBoard.sort((a, b) => b.score - a.score);

    this.updateRoom(code, {
      leaderboard: updatedBoard,
    });
  }
}

export const appStore = new AppStore();
