"use client";

import React, { useState, useEffect, useRef } from "react";
import { Center, Loader } from "@mantine/core";
import { Toaster, toast } from "react-hot-toast";
import * as Tone from "tone";

import Pagination from "@/components/Common/pagination";
import { fetchOrders } from "./services/orders";
import OrderTable from "./orderTable";

const POLLING_INTERVAL = 180000;

function OrderCard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<Tone.Player | null>(null);
  const prevOrdersCount = useRef(0);

  // إعداد Tone.Player وتحميل الصوت
  useEffect(() => {
    playerRef.current = new Tone.Player({
      url: "/sounds/cashsound.mp3",
      autostart: false,
    }).toDestination();
  }, []);

  // تفعيل الصوت بعد التفاعل
  useEffect(() => {
    const enableSound = async () => {
      await Tone.start(); // هذا هو المفتاح لتجاوز السياسات
      setHasInteracted(true);

      // إزالة المستمعين بعد التفاعل
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
      window.removeEventListener("touchstart", enableSound);
    };

    window.addEventListener("click", enableSound);
    window.addEventListener("keydown", enableSound);
    window.addEventListener("touchstart", enableSound);

    return () => {
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
      window.removeEventListener("touchstart", enableSound);
    };
  }, []);

  // استعلام الطلبات وتشغيل الصوت عند وصول طلب جديد
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const newOrders = await fetchOrders();
        setOrders(newOrders);

        const isNewOrder = prevOrdersCount.current && newOrders.length > prevOrdersCount.current;

        if (isNewOrder) {
          toast.success("🚨 طلب جديد!");

          if (hasInteracted && playerRef.current) {
            try {
              playerRef.current.start(); // تشغيل الصوت عبر Tone
            } catch (err) {
              console.log("فشل تشغيل الصوت عبر Tone:", err);
            }
          }
        }

        prevOrdersCount.current = newOrders.length;
        setLoading(false);
      } catch (error) {
        toast.error("فشل تحميل الطلبات");
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [hasInteracted]);

  if (loading) {
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <OrderTable orders={orders} />
      <Toaster />
    </>
  );
}

export default OrderCard;
