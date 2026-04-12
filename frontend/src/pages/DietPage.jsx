import React from "react";
import TaskTrackingLayout from "@/components/tasks/TaskTrackingLayout";

export const DietPage = () => (
  <TaskTrackingLayout 
    category="diet"
    title="Dietary Path"
    description="Nourishing your body according to your unique constitution. These daily recommendations help maintain your digestive fire (Agni) and sustain your vitality."
    icon="🌾"
  />
);

export default DietPage;
