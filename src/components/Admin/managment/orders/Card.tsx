
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Center, Loader } from "@mantine/core";
import { Toaster, toast } from "react-hot-toast";
import { fetchOrders } from "./services/orders";
import OrderTable from "./orderTable";

const POLLING_INTERVAL = 10000;

function OrderCard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevOrdersCount = useRef(0);

  // Set up audio element
  useEffect(() => {
    audioRef.current = new Audio("/sounds/cashsound.mp3");
  }, []);

  // Track user interaction once
  useEffect(() => {
    const enableSound = () => {
      setHasInteracted(true);
      window.removeEventListener("click", enableSound);
    };

    window.addEventListener("click", enableSound);
    return () => window.removeEventListener("click", enableSound);
  }, []);

  // Polling for orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const newOrders = await fetchOrders();
        setOrders(newOrders);

        if (
          prevOrdersCount.current &&
          newOrders.length > prevOrdersCount.current
        ) {
          toast.success("🚨 طلب جديد!");

          if (hasInteracted && audioRef.current) {
            audioRef.current.play().catch((err) => {
              console.log("فشل تشغيل الصوت:", err);
            });
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