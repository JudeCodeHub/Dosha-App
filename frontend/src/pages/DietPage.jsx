import React from "react";
import { useTranslation } from "react-i18next";
import TaskTrackingLayout from "@/components/tasks/TaskTrackingLayout";

export const DietPage = () => {
  const { t } = useTranslation();
  return (
    <TaskTrackingLayout
      category="diet"
      title={t("category.diet.title", "Dietary Path")}
      description={t(
        "category.diet.description",
        "Nourishing your body according to your unique constitution. These daily recommendations help maintain your digestive fire (Agni) and sustain your vitality."
      )}
      icon="🌾"
    />
  );
};

export default DietPage;
