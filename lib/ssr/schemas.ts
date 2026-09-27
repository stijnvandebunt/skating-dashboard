import { z } from "zod";

// SSR keeps its API loosely typed (numbers-as-strings, optional fields that
// silently disappear rather than being null) — schemas stay permissive and
// coerce rather than fail the whole batch on one odd row.

export const ssrSkaterRefSchema = z.object({
  id: z.coerce.number(),
  familyname: z.string(),
  givenname: z.string(),
  country: z.string().length(3),
});

export const ssrPersonalRecordSchema = z.object({
  distance: z.string(), // "500m", "1500m", "team pursuit", etc.
  time: z.string(),
  date: z.string().optional(),
  location: z.string().optional(),
  link: z.string().optional(),
});

export const ssrPersonalRecordsResponseSchema = z.object({
  skater: z.coerce.number(),
  personalrecords: z.array(ssrPersonalRecordSchema).default([]),
});

export const ssrSkaterResultSchema = z.object({
  time: z.string(),
  date: z.string(),
  location: z.string().optional(),
  name: z.string().optional(),
  link: z.string().optional(),
});

export const ssrSkaterResultsResponseSchema = z.object({
  skater: z.coerce.number(),
  distance: z.coerce.number(),
  season: z.coerce.number().optional(),
  results: z.array(ssrSkaterResultSchema).default([]),
});

export const ssrTopNEntrySchema = z.object({
  rank: z.coerce.number(),
  time: z.string(),
  skater: ssrSkaterRefSchema,
  date: z.string().optional(),
  location: z.string().optional(),
  event: z.string().optional(),
});

export const ssrTopNResponseSchema = z.object({
  season: z.coerce.number(),
  distance: z.string(),
  gender: z.enum(["m", "f"]),
  topn: z.array(ssrTopNEntrySchema).default([]),
});

export const ssrCompetitionRefSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  startdate: z.string(),
  enddate: z.string().optional(),
  link: z.string().optional(),
});

export const ssrTrackCompetitionsResponseSchema = z.object({
  track: z.coerce.number(),
  season: z.coerce.number().optional(),
  competitions: z.array(ssrCompetitionRefSchema).default([]),
});

export const ssrRecordEntrySchema = z.object({
  distance: z.string(),
  time: z.string(),
  skater: ssrSkaterRefSchema.optional(),
  date: z.string().optional(),
  location: z.string().optional(),
});

export const ssrRecordsResponseSchema = z.object({
  records: z.array(ssrRecordEntrySchema).default([]),
});

export const ssrSkaterLookupResponseSchema = z.object({
  skaters: z.array(ssrSkaterRefSchema).default([]),
});
