"use client";
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Center, Loader, Button } from "@mantine/core";
import { Toaster, toast } from "react-hot-toast";

import Pagination from "@/components/Common/pagination";

import { fetchOrders } from "./services/orders";
import OrderTable from "./orderTable";

function OrderCard() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="p-8">
      <Toaster position="top-center" />

      {loading ? (
        <Center mt="xl">
          <Loader size="lg" />
        </Center>
      ) : (
        <Center>
          <div
            style={{
             
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <OrderTable orders={currentProducts} />
          </div>
        </Center>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(products.length / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default OrderCard;
