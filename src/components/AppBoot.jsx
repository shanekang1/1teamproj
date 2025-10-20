import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../lib/supabase";
import { initSession, setUser } from "../store/slices/authSlice";
import {
  clearBusiness,
  fetchMyBusinesses,
} from "../store/slices/businessSlice";

export default function AppBoot() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(initSession());
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user || null;
      dispatch(setUser(u));
      if (u) dispatch(fetchMyBusinesses(u.id));
      else dispatch(clearBusiness());
    });
    return () => sub.subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchMyBusinesses(user.id));
  }, [dispatch, user]);

  return null; // 렌더링 안 함: 전역 초기화만 담당
}
