import { z } from "zod";

// Verified against the live API (Sept 2026) — field names here are what SSR
// actually returns, not what the docs page describes. Recheck with curl
// before changing: docs and reality have drifted before (e.g. personal
// records is keyed "records", not "personalrecords"; national records live
// at country_records.php).

export const ssrSkaterRefSchema = z.object({
  id: z.coerce.number(),
  familyname: z.string(),
  givenname: z.string(),
  familynative: z.string().optional(),
  givennative: z.string().optional(),
  country: z.string().length(3),
});

const distanceLike = z.union([z.string(), z.coerce.number()]).transform(String);

export const ssrPersonalRecordEntrySchema = z.object({
  distance: distanceLike,
  time: z.string(),
  date: z.string().optional(),
  location: z.string().optional(),
});

export const ssrPersonalRecordsResponseSchema = z.object({
  skater: z.coerce.number(),
  records: z.array(ssrPersonalRecordEntrySchema).default([]),
});

export const ssrSeasonBestsResponseSchema = z.object({
  skater: z.coerce.number(),
  seasons: z
    .array(
      z.object({
        start: z.coerce.number(),
        records: z.array(ssrPersonalRecordEntrySchema).default([]),
      }),
    )
    .default([]),
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
  distance: distanceLike,
  gender: z.enum(["m", "f"]),
  topn: z.array(ssrTopNEntrySchema).default([]),
});

export const ssrCompetitionRefSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  startdate: z.string(),
  enddate: z.string().optional(),
  location: z.string().optional(),
  trackid: z.coerce.number().optional(),
  link: z.string().optional(),
});

export const ssrTrackCompetitionsResponseSchema = z.object({
  track: z.coerce.number(),
  season: z.coerce.number().optional(),
  competitions: z.array(ssrCompetitionRefSchema).default([]),
});

export const ssrSkaterCompetitionsResponseSchema = z.object({
  skater: z.coerce.number(),
  season: z.coerce.number().optional(),
  competitions: z.array(ssrCompetitionRefSchema).default([]),
});

export const ssrRecordEntrySchema = z.object({
  gender: z.enum(["m", "f"]),
  age: z.enum(["sr", "jr"]).optional(),
  distance: z.coerce.number(),
  time: z.string(),
  date: z.string().optional(),
  location: z.string().optional(),
  skater: ssrSkaterRefSchema.optional(),
});

export const ssrRecordsResponseSchema = z.object({
  records: z.array(ssrRecordEntrySchema).default([]),
});

export const ssrCountryRecordsResponseSchema = z.object({
  country: z.string(),
  records: z.array(ssrRecordEntrySchema).default([]),
});

// category comes back as either a number (masters age category) or a short
// code like "SA"/"YD"/"YB" (senior/youth/junior sub-groups) — kept as string.
export const ssrSkaterLookupEntrySchema = ssrSkaterRefSchema.extend({
  gender: z.enum(["m", "f"]),
  category: z.union([z.string(), z.coerce.number()]).transform(String).optional(),
});

export const ssrSkaterLookupResponseSchema = z.object({
  skaters: z.array(ssrSkaterLookupEntrySchema).default([]),
});

export const ssrSeedTimeEntrySchema = z.object({
  distance: distanceLike,
  time: z.string(),
  date: z.string().optional(),
  location: z.string().optional(),
});

export const ssrSeedTimesResponseSchema = z.object({
  skater: z.coerce.number(),
  times: z.array(ssrSeedTimeEntrySchema).default([]),
});
