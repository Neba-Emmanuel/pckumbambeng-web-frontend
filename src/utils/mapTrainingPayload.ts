import slugify from "slugify";
import { TrainingFormData } from "@/src/components/admin/TrainingForm";

export const mapTrainingPayload = (
  data: TrainingFormData,
  options?: { existingSlug?: string },
) => {
  return {
    title: data.title.trim(),

    slug:
      options?.existingSlug ??
      slugify(data.title, {
        lower: true,
        strict: true,
        trim: true,
      }),

    summary: data.summary?.trim() || null,

    objectives: data.objectives?.trim() || null,

    eligibility: data.eligibility?.trim() || null,

    outline: data.outline?.trim() || null,

    resources: data.resources?.trim() || null,

    slots: data.slots.map(({ id, ...slot }) => ({
      startDate: slot.startDate || null,
      endDate: slot.endDate || null,
      schedule: slot.schedule?.trim() || null,
      seats: Number(slot.seats),
      availableSeats: Number(slot.availableSeats),
    })),

    price: Number(data.price),
    imageUrl: data.imageUrl || null,
  };
};
