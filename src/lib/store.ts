import { COURSE_CHALLENGES, ChallengeItem } from "./challenges-data";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  role: "student" | "teacher";
  full_name: string;
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
  private localKey = "ozing_yoz_data";
  private channel: BroadcastChannel | null = null;
  private listeners: Set<() => void> = new Set();

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
    try {
      const raw = localStorage.getItem(this.localKey);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      profile: {
        id: "student-demo-id",
        role: "student",
        full_name: "Azizbek Rahimov",
        username: "azizbek",
        xp: 285,
        streak: 3,
        is_guest: false,
      } as UserProfile,
      customChallenges: [] as ChallengeItem[],
      completedIds: ["11111111-1111-1111-1111-111111111111"],
      codeDrafts: {} as Record<string, { html: string; css: string }>,
      rooms: {} as Record<string, LiveRoomState>,
    };
  }

  private saveLocalData(data: any) {
    try {
      localStorage.setItem(this.localKey, JSON.stringify(data));
      this.channel?.postMessage({ type: "STORE_UPDATE" });
      this.notify();
    } catch (_) {}
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
  saveDraft(challengeId: string, html: string, css: string) {
    const data = this.getLocalData();
    data.codeDrafts[challengeId] = { html, css };
    this.saveLocalData(data);
  }

  getDraft(challengeId: string): { html: string; css: string } | null {
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
      leaderboard: [
        { user_id: "1", nickname: "Javohir", score: 95, passed: true, hintLevel: 1, code_snippet: ".container { display: flex; justify-content: center; align-items: center; }" },
        { user_id: "2", nickname: "Madina", score: 90, passed: true, hintLevel: 2, code_snippet: ".container { display: flex; justify-content: center; }" },
        { user_id: "3", nickname: "Sardor", score: 70, passed: false, hintLevel: 3, code_snippet: ".container { display: block; margin: auto; }" },
        { user_id: "4", nickname: "Jasmina", score: 85, passed: false, hintLevel: 2, code_snippet: ".container { align-items: center; }" },
      ],
      concept_counts: {
        flexbox: 14,
        "box-model": 8,
        selectors: 4,
        grid: 2,
      },
      latest_nudge: null,
    };
    return defaultRoom;
  }

  updateRoom(code: string, updates: Partial<LiveRoomState>) {
    const data = this.getLocalData();
    const current = this.getRoom(code);
    data.rooms[code] = { ...current, ...updates };
    this.saveLocalData(data);
  }
}

export const appStore = new AppStore();
