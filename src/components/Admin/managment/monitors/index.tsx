"use client";

import React, { useEffect, useState } from "react";
import { Card, Group, Text, Title, Loader, Center, List } from "@mantine/core";
import {
  FaDatabase,
  FaMapMarkerAlt,
  FaLock,
  FaKey,
  FaFolderOpen,
  FaCloud,
  FaServer,
  FaTable,
  FaHdd,
} from "react-icons/fa";

export default function Monitors() {
  const [s3Info, setS3Info] = useState<any>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/Admin/s3-usage").then((res) => res.json()),
      fetch("/api/Admin/db-info").then((res) => res.json()),
    ])
      .then(([s3Data, dbData]) => {
        setS3Info(s3Data);
        setDbInfo(dbData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch info:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!s3Info || s3Info.error) {
    return (
      <Center mt="xl">
        <Text color="red" >
          Error loading S3 bucket info.
        </Text>
      </Center>
    );
  }

  if (!dbInfo || !dbInfo.connected) {
    return (
      <Center mt="xl">
        <Text color="red" >
          Error loading database info.
        </Text>
      </Center>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-10 max-w-6xl mx-auto">
      {/* S3 Info */}
      <Card shadow="sm" radius="md" padding="lg" withBorder>
        <Title order={3}  mb="md">
          <Group  justify="center">
            <FaCloud size={20} />
            <span>S3 Bucket Information</span>
          </Group>
        </Title>

        <List spacing="sm" size="sm">
          <List.Item icon={<FaFolderOpen size={16} />}>
            <Text><strong>Bucket Name:</strong> {s3Info.bucket}</Text>
          </List.Item>
          <List.Item icon={<FaMapMarkerAlt size={16} />}>
            <Text><strong>Region:</strong> {s3Info.region}</Text>
          </List.Item>
          <List.Item icon={<FaKey size={16} />}>
            <Text><strong>Versioning:</strong> {s3Info.versioning ? "Enabled" : "Disabled"}</Text>
          </List.Item>
          <List.Item icon={<FaLock size={16} />}>
            <Text><strong>Encryption:</strong> {s3Info.encryption ? "Enabled" : "Disabled"}</Text>
          </List.Item>
          <List.Item icon={<FaLock size={16} />}>
            <Text><strong>Public Access:</strong> {s3Info.isPublic ? "Yes" : "No"}</Text>
          </List.Item>
          <List.Item icon={<FaDatabase size={16} />}>
            <Text><strong>Number of Files:</strong> {s3Info.totalCount}</Text>
          </List.Item>
          <List.Item icon={<FaDatabase size={16} />}>
            <Text><strong>Total Size:</strong> {s3Info.totalSizeMB.toFixed(2)} MB</Text>
          </List.Item>
        </List>
      </Card>

      {/* DB Info */}
      <Card shadow="sm" radius="md" padding="lg" withBorder>
        <Title order={3}  mb="md">
          <Group  justify="center">
            <FaServer size={20} />
            <span>Database Information</span>
          </Group>
        </Title>

        <List spacing="sm" size="sm">
          <List.Item icon={<FaDatabase size={16} />}>
            <Text><strong>Connection Status:</strong> {dbInfo.connected ? "Connected" : "Disconnected"}</Text>
          </List.Item>
          <List.Item icon={<FaKey size={16} />}>
            <Text><strong>Version:</strong> {dbInfo.version}</Text>
          </List.Item>
          <List.Item icon={<FaTable size={16} />}>
            <Text><strong>Number of Tables:</strong> {dbInfo.tableCount}</Text>
          </List.Item>
          <List.Item icon={<FaHdd size={16} />}>
            <Text>
              <strong>Database Usage:</strong>{" "}
              {dbInfo.sizeMB.toFixed(2)} MB / {dbInfo.maxSizeMB} MB (
              {((dbInfo.sizeMB / dbInfo.maxSizeMB) * 100).toFixed(1)}%)
            </Text>
          </List.Item>
        </List>
      </Card>
    </div>
  );
}
