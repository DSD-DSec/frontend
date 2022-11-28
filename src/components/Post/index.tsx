import { urlForImage } from '@/lib/sanity/sanity';
import { Avatar, Box, Container, Flex, Heading } from '@chakra-ui/react';
import { PortableText } from '@portabletext/react';
import Head from 'next/head';
import Image from 'next/image';
import { FC } from 'react';

interface IPostProps {
	data: any;
}

export const Post: FC<IPostProps> = ({ data: { post }, ...rest }) => {
	console.log(post);
	return (
		<article {...rest}>
			<Head>
				<title>{post.title}</title>
				{post.coverImage?.asset?._ref && (
					<meta
						key="ogImage"
						property="og:image"
						content={urlForImage(post.coverImage).width(1200).height(627).fit('crop').url()}
					/>
				)}
			</Head>

			<header>
				<Heading as="h2">{post.title}</Heading>

				<Flex align="center" gap={2} mt={4}>
					<Avatar boxSize={8} src={urlForImage(post.author.picture).width(64).height(64).fit('crop').url()} />
					<Heading as="h3" size="md">
						By {post.author.name}
					</Heading>
				</Flex>
			</header>

			<Box as="main" my={8}>
				{post.coverImage?.asset?._ref ? (
					<Box position="relative" mb={8}>
						<Image
							alt={post.title}
							src={urlForImage(post.coverImage).width(1200).height(627).fit('crop').url()}
							height={627}
							width={1200}
						/>
					</Box>
				) : null}

				<Container textAlign="justify">
					<PortableText value={post.content} />
				</Container>
				{/* {post.content.map((block) => {
					if (block._type === 'block') {
						return <p key={block._key}>{block.children.map((child) => child.text)}</p>;
					}
				})} */}
			</Box>

			{/* <PostHeader title={post.title} coverImage={post.coverImage} date={post.date} author={post.author} /> */}
			{/* <PostBody content={post.content} /> */}
		</article>
	);
};
