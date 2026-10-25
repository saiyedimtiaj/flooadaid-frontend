"use client";

import { useEffect } from "react";
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
 * One Pusher connection for the whole app:
 * - `alerts` (public): new flood alerts refresh alert lists and the live map.
 * - `sos-feed` (admins/volunteers): new SOS requests refresh the queue.
 * - `user-<id>` (logged in): personal notifications with a chime + toast.
 * Renders nothing; no-ops when Pusher env is not configured.
 */
export function NotificationsRealtime() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  const userId = user?.id;
  const isStaff = user?.role === "ADMIN" || user?.role === "VOLUNTEER";

  useEffect(() => {
    if (!PUSHER_KEY || !PUSHER_CLUSTER) return;

    // The import is async: if the effect is torn down before it resolves we
    // must not connect at all, otherwise the socket would leak.
    let cancelled = false;
    let teardown: (() => void) | undefined;

    void import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return;
      const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER });

      const alerts = pusher.subscribe("alerts");
      alerts.bind("alert-created", () => {
        queryClient.invalidateQueries({ queryKey: ["alerts"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      });

      if (isStaff) {
        pusher.subscribe("sos-feed").bind("sos-created", () => {
          queryClient.invalidateQueries({ queryKey: ["sos"] });
        });
      }

      if (userId) {
        pusher.subscribe(`user-${userId}`).bind("notification", (data: AppNotification) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          playChime();
          toast(data.title, { description: data.message });
        });
      }

      teardown = () => pusher.disconnect();
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [userId, isStaff, queryClient]);

  return null;
}
