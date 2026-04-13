import React from "react";
import { useTranslation } from "react-i18next";
import TaskTrackingLayout from "@/components/tasks/TaskTrackingLayout";

export const RoutinePage = () => {
  const { t } = useTranslation();
  return (
    <TaskTrackingLayout
      category="routine"
      title={t("category.routine.title", "Daily Rhythm")}
      description={t(
        "category.routine.description",
        "Your Dinacharya blueprint. Synchronizing your daily actions with the rhythms of nature to promote long-term harmony and health."
      )}
      icon="🌅"
    />
  );
};

export default RoutinePage;
