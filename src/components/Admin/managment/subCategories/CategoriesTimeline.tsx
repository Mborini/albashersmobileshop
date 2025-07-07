import { Timeline, Group, Text } from "@mantine/core";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

export default function SubCategoriesTimeline({ subCategories , category }) {
  return (
   <Timeline bulletSize={18} lineWidth={2} color="blue" style={{ flex: 1 }}>
  <Timeline.Item
    title={category}
    bullet={<FaPlusCircle size={18} color="green" />}
  >
    <Text c="dimmed" size="sm">
      Category
    </Text>
  </Timeline.Item>

  <Timeline.Item
    title={subCategories}
    bullet={<FaMinusCircle size={18} color="red" />}
  >
    <Text c="dimmed" size="sm">
        Sub Category
    </Text>
  </Timeline.Item>
</Timeline>

  );
}
