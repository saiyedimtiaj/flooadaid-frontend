"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import type { AppNotification } from "@/lib/types/api";

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

/**
 * Plays a short two-tone chime using the Web Audio API so we don't need to
 * bundle an audio file. Called when a realtime notification arrives.
 */
function playChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [880, 1174].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.15;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.35);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Audio not available (autoplay policy, etc.) — ignore.
  }
}

/**
 * Subscribes to the logged-in user's Pusher channel and reacts to new
 * notifications: refresh the query, play a chime, show a toast. Renders
 * nothing. No-ops entirely when Pusher env is not configured.
 */
export function NotificationsRealtime() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  // Keep a ref to avoid re-subscribing on every render.
  const boundRef = useRef(false);

  useEffect(() => {
    if (!PUSHER_KEY || !PUSHER_CLUSTER || !user?.id) return;
    if (boundRef.current) return;
    boundRef.current = true;

    let cleanup: (() => void) | undefined;

    // Dynamic import so pusher-js only loads when actually used.
    void import("pusher-js").then(({ default: Pusher }) => {
      const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER });
      const channel = pusher.subscribe(`user-${user.id}`);

      const handler = (data: AppNotification) => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        playChime();
        toast(data.title, { description: data.message });
      };

      channel.bind("notification", handler);

      cleanup = () => {
        channel.unbind("notification", handler);
        pusher.unsubscribe(`user-${user.id}`);
        pusher.disconnect();
        boundRef.current = false;
      };
    });

    return () => cleanup?.();
  }, [user?.id, queryClient]);

  return null;
}
