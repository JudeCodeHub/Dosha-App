import React from "react";
import { useTranslation } from "react-i18next";
import TaskTrackingLayout from "@/components/tasks/TaskTrackingLayout";

export const YogaPage = () => {
  const { t } = useTranslation();
  return (
    <TaskTrackingLayout
      category="yoga"
      title={t("category.yoga.title", "Yoga & Exercise")}
      description={t(
        "category.yoga.description",
        "Ancient movement practices designed to balance your specific energy. These sequences focus on stabilizing your unique physiology."
      )}
      icon="🧘"
    />
  );
};

export default YogaPage;
