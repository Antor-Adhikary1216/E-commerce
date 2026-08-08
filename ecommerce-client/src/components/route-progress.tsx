"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { useLoadingContext } from "@/contexts/loading-context";

let startProgress: () => void;
let finishProgress: () => void;

export function triggerProgress() {
  startProgress();
}

export function completeProgress() {
  finishProgress();
}

export function RouteProgress() {
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const elRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const { setRouteLoading, setApiLoading } = useLoadingContext();

  const setProgress = useCallback((value: number) => {
    progressRef.current = value;
    if (elRef.current) {
      elRef.current.style.width = `${value}%`;
    }
  }, []);

  const start = useCallback(() => {
    activeRef.current++;
    if (activeRef.current === 1) {
      setProgress(0);
      cancelAnimationFrame(rafRef.current);
      let current = 0;
      const tick = () => {
        current += (100 - current) * 0.15;
        if (current > 90) current = 90;
        setProgress(current);
        if (current < 90) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [setProgress]);

  const finish = useCallback(() => {
    activeRef.current = Math.max(0, activeRef.current - 1);
    if (activeRef.current === 0) {
      cancelAnimationFrame(rafRef.current);
      setProgress(100);
      setTimeout(() => setProgress(0), 300);
    }
  }, [setProgress]);

  useEffect(() => {
    startProgress = start;
    finishProgress = finish;
  }, [start, finish]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setRouteLoading(true);
    start();
    const t = setTimeout(() => {
      finish();
      setRouteLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [pathname, searchParams, start, finish, setRouteLoading]);

  useEffect(() => {
    const reqInterceptor = (config: { __progress?: boolean }) => {
      config.__progress = true;
      start();
      setApiLoading(true);
      return config;
    };

    const onFulfilled = (response: { config?: { __progress?: boolean } }) => {
      if (response.config?.__progress) {
        finish();
        setApiLoading(false);
      }
      return response;
    };

    const onRejected = (error: { config?: { __progress?: boolean } }) => {
      if (error.config?.__progress) {
        finish();
        setApiLoading(false);
      }
      return Promise.reject(error);
    };

    const axios = require("axios");
    const instance = axios.default || axios;
    const id = instance.interceptors.request.use(reqInterceptor);
    const idRes = instance.interceptors.response.use(onFulfilled, onRejected);

    return () => {
      instance.interceptors.request.eject(id);
      instance.interceptors.response.eject(idRes);
    };
  }, [start, finish, setApiLoading]);

  return (
    <div
      ref={elRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: "0%",
        zIndex: 9999,
        background: "linear-gradient(90deg, #f97316, #fb923c, #fdba74)",
        transition: "width 0.25s ease-out, opacity 0.3s ease",
        opacity: progressRef.current > 0 && progressRef.current < 100 ? 1 : 0,
        boxShadow: "0 0 8px rgba(249,115,22,0.5)",
      }}
    />
  );
}
