import React, {useState} from 'react';
import {nanoid} from 'nanoid';

import client from 'part:@sanity/base/client';
import {
	useToast,
	Box,
	Stack,
	Button,
	Spinner,
	Dialog,
	TextInput,
	Label,
} from '@sanity/ui';

const WEBHOOK_TYPE = 'webhook_deploy';

const DeployModalNew = ({onClose}) => {
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [pendingHook, setPendingHook] = useState({
		title: '',
		url: '',
		statusBadgeUrl: '',
	});
	const isFormDisabled =
		!pendingHook.title || !pendingHook.url || !pendingHook.statusBadgeUrl;

	const onCloseNewModal = () => {
		onClose(false);
	};

	const onSubmit = async event => {
		event.preventDefault();

		setIsLoading(true);

		try {
			await client.create({
				_id: `netlify-deploy.${nanoid()}`,
				_type: WEBHOOK_TYPE,
				title: pendingHook.title,
				url: pendingHook.url,
				statusBadgeUrl: pendingHook.statusBadgeUrl,
			});
		} catch (error) {
			toast.push({
				status: 'error',
				title: 'An error occured in creating this webhook.',
			});
		}

		setIsLoading(false);

		toast.push({
			status: 'success',
			title: `Added ${pendingHook.title}!`,
		});

		onCloseNewModal();
	};

	return (
		<Dialog
			width={1}
			header="New Netlify Enviroment"
			onClose={onCloseNewModal}>
			<Box padding={4}>
				<form onSubmit={onSubmit}>
					<Stack space={5}>
						<Box>
							<Box marginBottom={3}>
								<Label>Title</Label>
							</Box>
							<TextInput
								value={pendingHook.title}
								onChange={event =>
									setPendingHook({
										...pendingHook,
										title: event.target.value,
									})
								}
							/>
						</Box>
						<Box>
							<Box marginBottom={3}>
								<Label>URL</Label>
							</Box>
							<TextInput
								value={pendingHook.url}
								onChange={event =>
									setPendingHook({
										...pendingHook,
										url: event.target.value,
									})
								}
							/>
						</Box>
						<Box>
							<Box marginBottom={3}>
								<Label>Status Badge URL</Label>
							</Box>
							<TextInput
								value={pendingHook.statusBadgeUrl}
								onChange={event =>
									setPendingHook({
										...pendingHook,
										statusBadgeUrl: event.target.value,
									})
								}
							/>
						</Box>
						<Box>
							{isLoading ? (
								<Spinner />
							) : (
								<Button
									disabled={isFormDisabled}
									type="submit"
									tone="primary"
									text={
										isFormDisabled
											? 'Fill out required fields.'
											: 'Create'
									}
								/>
							)}
						</Box>
					</Stack>
				</form>
			</Box>
		</Dialog>
	);
};

export default DeployModalNew;
