'use client';

import { Post } from '@/components/Post';
import { postQuery } from '@/lib/sanity/queries';
import { usePreviewSubscription } from '@/lib/sanity/sanity';
import { useRouter } from 'next/router';

export function PostPreview({ data: initialData }) {
	const router = useRouter();

	const data = usePreviewSubscription(null, postQuery, {
		params: { slug: router.query.slug },
		initialData,
	});

	return <Post data={data} />;
}
