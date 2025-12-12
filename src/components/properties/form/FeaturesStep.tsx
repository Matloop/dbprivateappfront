"use client";

import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureListGroup } from "./FeatureListGroup";
import { ROOM_OPTS, PROPERTY_OPTS, DEVELOPMENT_OPTS, styles } from "./constants";

export function FeaturesStep() {
  return (
    <Card className={styles.sectionClass}>
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-primary flex items-center gap-2 text-base">
          <Plus size={18} /> CARACTERÍSTICAS
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureListGroup
          title="Ambientes"
          name="roomFeatures"
          options={ROOM_OPTS}
        />
        <FeatureListGroup
          title="Do Imóvel"
          name="propertyFeatures"
          options={PROPERTY_OPTS}
        />
        <FeatureListGroup
          title="Empreendimento"
          name="developmentFeatures"
          options={DEVELOPMENT_OPTS}
        />
      </CardContent>
    </Card>
  );
}