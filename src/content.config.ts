import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				evidenceLevel: z.enum(['A', 'B', 'C', 'X']),
				lastReviewed: z.coerce.date(),
				references: z.array(z.string()),
			}),
		}),
	}),
};
