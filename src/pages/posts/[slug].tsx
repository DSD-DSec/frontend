import { PreviewLayout } from '@/components/MainLayout/MainLayout';
import { MainNavigation } from '@/components/MainNavigation/MainNavigation';
import { Post } from '@/components/Post';
import { PostPreview } from '@/components/PostPreview';
import { MainLayout } from '@/components/PreviewLayout';
import { postQuery, postSlugsQuery } from '@/lib/sanity/queries';
import { getClient, sanityClient } from '@/lib/sanity/sanity.server';
import { Container } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PreviewSuspense } from 'next-sanity/preview';

export default function PostPage({ data, preview }: InferGetStaticPropsType<typeof getStaticProps>) {
	if (preview) {
		<PreviewLayout navigation={<MainNavigation />}>
			<Container maxW="container.xl" mt={16}>
				<PreviewSuspense fallback="Loading...">
					<PostPreview data={data} />
				</PreviewSuspense>
			</Container>
		</PreviewLayout>;
	}

	return (
		<MainLayout navigation={<MainNavigation />}>
			<Container maxW="container.xl" mt={16}>
				<PreviewSuspense fallback="Loading...">
					<Post data={data} />
				</PreviewSuspense>
			</Container>
		</MainLayout>
	);
}

export async function getStaticProps({ params, preview = false, locale }) {
	const { post } = await getClient(preview).fetch(postQuery, {
		slug: params.slug,
	});

	return {
		props: {
			preview,
			data: {
				post,
			},
			...(await serverSideTranslations(String(locale), ['common'])),
		},
		// If webhooks isn't setup then attempt to re-generate in 1 minute intervals
		revalidate: process.env.SANITY_REVALIDATE_SECRET ? undefined : 60,
	};
}

export async function getStaticPaths() {
	const paths = await sanityClient.fetch(postSlugsQuery);
	return {
		paths: paths.map((slug) => ({ params: { slug } })),
		fallback: true,
	};
}
