import React, {useState, useEffect} from 'react';
import client from 'part:@sanity/base/client';
import {Box, Card, Stack, Spinner} from '@sanity/ui';
import DeployItem from './DeployItem';

const WEBHOOK_TYPE = 'webhook_deploy';
const WEBHOOK_QUERY = `*[_type == "${WEBHOOK_TYPE}"] | order(_createdAt)`;

//
// === List of Deploys ===
//

const DeployList = () => {
	const [isLoadingInitialList, setIsLoading] = useState(false);
	const [webhooks, setWebhooks] = useState([]);

	const fetchInitialList = () => {
		setIsLoading(true);

		client.fetch(WEBHOOK_QUERY).then(webhooks => {
			setWebhooks(webhooks);
			setIsLoading(false);
		});
	};

	const onSubscriptionUpdate = res => {
		const wasCreated = res.mutations.some(item =>
			Object.prototype.hasOwnProperty.call(item, 'create'),
		);
		const wasDeleted = res.mutations.some(item =>
			Object.prototype.hasOwnProperty.call(item, 'delete'),
		);

		if (wasCreated) {
			setWebhooks([...webhooks, res.result]);
		} else if (wasDeleted) {
			setWebhooks(webhooks.filter(hook => hook._id !== res.documentId));
		}
	};

	// Fetch all to start
	useEffect(fetchInitialList, []);

	// Listen to webhook changes
	useEffect(() => {
		const subscription = client
			.listen(WEBHOOK_QUERY, {}, {includeResult: true})
			.subscribe(onSubscriptionUpdate);

		// Unsubscribe
		return () => {
			subscription.unsubscribe();
		};
	}, [onSubscriptionUpdate]);

	return isLoadingInitialList ? (
		<Box marginY={4}>
			<Spinner />
		</Box>
	) : (
		<Stack space={4}>
			{webhooks.map(hook => (
				<DeployItem key={hook._id} hook={hook} />
			))}
			{!webhooks.length && (
				<Card padding={4} radius={2} shadow={1}>
					There are no environments yet.
				</Card>
			)}
		</Stack>
	);
};

export default DeployList;
